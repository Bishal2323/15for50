import { Router, Request, Response } from 'express';
import { DailyReport, AthleteReports } from '../models/dailyReport.model';
import { RiskScore } from '../models/riskScore.model';
import { requireAuth } from '../middleware/auth';
import { computeRisk } from '../services/risk';
import { RiskFactor } from '../models/riskFactor.model';
import { loadEnv } from '../setup/env';
import { User } from '../models/user.model';

const router = Router();

router.get('/', requireAuth, async (req: Request, res: Response) => {
  const user = (req as any).user;
  const athleteId = (req.query.athleteId as string) || user.id;

  // Try new schema first, fallback to old schema for backward compatibility
  let athleteReports = await AthleteReports.findOne({ athleteId });

  if (athleteReports) {
    // Return reports from new schema, sorted by date
    const reports = athleteReports.dailyReports.sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return res.json({ reports });
  } else {
    // Fallback to old schema
    const reports = await DailyReport.find({ athleteId }).sort({ date: 1 });
    return res.json({ reports });
  }
});

router.post('/', requireAuth, async (req: Request, res: Response) => {
  const env = loadEnv();
  const user = (req as any).user;
  const payload = req.body;
  // Fetch current user to read aclRisk prior (null -> 0)
  let currentAclRisk = 0;
  try {
    const dbUser = await User.findById(user.id).lean();
    currentAclRisk = typeof dbUser?.aclRisk === 'number' ? dbUser!.aclRisk! : 0;
  } catch { }

  // Use provided date or default to current date
  const reportDate = payload.date ? new Date(payload.date) : new Date();

  // Create the report data object
  const reportData = {
    date: reportDate,

    // Sleep & Recovery
    sleepHours: payload.sleepHours,
    sleepQuality: payload.sleepQuality,

    // Physical State
    fatigueLevel: payload.fatigueLevel,
    stressLevel: payload.stressLevel,
    painLevel: payload.painLevel,
    painAreas: payload.painAreas || [],
    jointStrain: payload.jointStrain,
    localSoreness: payload.localSoreness,
    readinessToTrain: payload.readinessToTrain,

    // Mental State
    mood: payload.mood,
    nonSportStressors: payload.nonSportStressors,
    nonSportStressorsNotes: payload.nonSportStressorsNotes,

    // Training (Optional)
    trainingIntensity: payload.trainingIntensity,
    trainingDuration: payload.trainingDuration,
    trainingRPE: payload.trainingRPE,
    trainingLoadSRPE: payload.trainingLoadSRPE,

    // Female Athletes (Optional)
    menstrualStatus: payload.menstrualStatus,

    // Per-body-part attributes (nullable fields allowed)
    bodyAttributes: payload.bodyAttributes ?? {},

    // General
    notes: payload.notes,
    comments: payload.comments, // Legacy field
    symptoms: payload.symptoms || [],
  };

  // Find or create athlete reports document
  let athleteReports = await AthleteReports.findOne({ athleteId: user.id });

  if (!athleteReports) {
    // Create new athlete reports document
    athleteReports = await AthleteReports.create({
      athleteId: user.id,
      dailyReports: [reportData]
    });
  } else {
    // Check if report for this date already exists
    const existingReportIndex = athleteReports.dailyReports.findIndex(
      report => report.date.toDateString() === reportDate.toDateString()
    );

    if (existingReportIndex >= 0) {
      // Update existing report subdocument safely
      const existingEntry = athleteReports.dailyReports[existingReportIndex];
      existingEntry.set(reportData as any);
    } else {
      // Add new report
      athleteReports.dailyReports.push(reportData);
    }

    await athleteReports.save();
  }

  // Get the created/updated report
  const report = athleteReports.dailyReports.find(
    r => r.date.toDateString() === reportDate.toDateString()
  );

  // Get all reports for risk calculation from new schema
  const allReports = athleteReports.dailyReports.sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Updated metrics for risk calculation - include new relevant fields
  const metrics = allReports.map((r: any) => ({
    // Core metrics for risk calculation
    trainingDuration: r.trainingDuration || 0,
    fatigueLevel: r.fatigueLevel,
    sleepHours: r.sleepHours,
    sleepQuality: r.sleepQuality,
    stressLevel: r.stressLevel,
    // Legacy metrics: default to 0 if missing
    painLevel: typeof r.painLevel === 'number' ? r.painLevel : 0,
    localSoreness: typeof r.localSoreness === 'number' ? r.localSoreness : 0,
    readinessToTrain: r.readinessToTrain,
    mood: r.mood,
    trainingRPE: r.trainingRPE || 0,
    trainingLoadSRPE: r.trainingLoadSRPE || 0,

    // Legacy fields for backward compatibility
    kneeStabilityL: r.kneeStabilityL,
    kneeStabilityR: r.kneeStabilityR,
  }));

  const risk = computeRisk(metrics);
  await RiskScore.create({ athleteId: user.id, date: report!.date, ...risk });

  // Build historical averages (excluding the current report)
  const previousReports = allReports.filter((r: any) => r.date.toDateString() !== reportDate.toDateString());
  function avg(nums: number[]) { const arr = nums.filter(n => typeof n === 'number' && !Number.isNaN(n)); return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : undefined; }
  const historicalAverages = {
    sleepHours: avg(previousReports.map((r: any) => r.sleepHours)),
    sleepQuality: avg(previousReports.map((r: any) => r.sleepQuality)),
    fatigueLevel: avg(previousReports.map((r: any) => r.fatigueLevel)),
    stressLevel: avg(previousReports.map((r: any) => r.stressLevel)),
    readinessToTrain: avg(previousReports.map((r: any) => r.readinessToTrain)),
    mood: avg(previousReports.map((r: any) => r.mood)),
    trainingRPE: avg(previousReports.map((r: any) => r.trainingRPE || 0)),
    trainingLoadSRPE: avg(previousReports.map((r: any) => r.trainingLoadSRPE || 0)),
    trainingDuration: avg(previousReports.map((r: any) => r.trainingDuration || 0)),
  };

  // RiskFactor averages for strength/neuromuscular and anatomical context
  const rfDoc = await RiskFactor.findOrCreateByAthleteId(user.id);
  const avgMetric = (arr: Array<{ value: number }> = []) => {
    const vals = (arr || []).map(x => Number(x.value)).filter(v => Number.isFinite(v));
    return vals.length ? Number((vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(2)) : 0;
  };
  const strengthAsymmetryAvg = avgMetric(rfDoc.strengthAsymmetry as any);
  const neuromuscularControlAvg = avgMetric(rfDoc.neuromuscularControl as any);
  const anatomicalAvg = avgMetric(rfDoc.anatomicalFixedRisk as any);
  const strengthNote = strengthAsymmetryAvg === 0 && !(rfDoc.strengthAsymmetry && rfDoc.strengthAsymmetry.length)
    ? 'No past strengthAsymmetry data provided by user; treat as 0 by default.'
    : '';
  const neuroNote = neuromuscularControlAvg === 0 && !(rfDoc.neuromuscularControl && rfDoc.neuromuscularControl.length)
    ? 'No past neuromuscularControl data provided by user; treat as 0 by default.'
    : '';
  const anatomicalNote = anatomicalAvg === 0 && !(rfDoc.anatomicalFixedRisk && rfDoc.anatomicalFixedRisk.length)
    ? 'AnatomicalRisk constitutes 30%, but no data provided; treat as 0 by default.'
    : '';

  // Prepare prompt for Gemini
  const prompt = `You are an expert sports performance analyst. Based on the CURRENT daily athlete report and HISTORICAL AVERAGES, estimate and return STRICT JSON: {"workloadManagement": <integer 1-10>, "mentalRecovery": <integer 1-10>, "aclRisk": <integer 1-100>, "recommendation": "<short actionable tip>"}.

IMPORTANT WEIGHTING NOTES:
- workloadManagement + mentalRecovery together constitute 20% of aclRisk.
- strengthAsymmetry + neuromuscularControl together constitute 50% of aclRisk. If no past data is provided for either, treat that category as 0 by default.
- anatomicalRisk constitutes 30% of aclRisk. If no anatomical data is available, treat it as 0 by default.

Do NOT generalize categories. Use the named categories with the weights above.

PRIOR ACL RISK: Use currentAclRisk as prior; if it is 0 it means unknown. Do NOT skew aclRisk too much if the provided data points are not strongly indicative. Prefer small adjustments around currentAclRisk unless signals are significant.

CURRENT REPORT (fields and scales noted): ${JSON.stringify({
    sleepHours: reportData.sleepHours, // hours 0-24
    sleepQuality: reportData.sleepQuality, // 1-10
    fatigueLevel: reportData.fatigueLevel, // 0-100
    stressLevel: reportData.stressLevel, // 0-100
    readinessToTrain: reportData.readinessToTrain, // 1-10
    mood: reportData.mood, // 1-10
    trainingRPE: reportData.trainingRPE, // 1-10
    trainingLoadSRPE: reportData.trainingLoadSRPE, // arbitrary load
    trainingDuration: reportData.trainingDuration // minutes
  })}

HISTORICAL AVERAGES (same fields): ${JSON.stringify(historicalAverages)}

PAST STRENGTH/NEURO AVERAGES (1-10 scales from RiskFactor): ${JSON.stringify({ strengthAsymmetryAvg, neuromuscularControlAvg })}
${strengthNote}${strengthNote && (neuroNote || anatomicalNote) ? ' ' : ''}${neuroNote}${(strengthNote || neuroNote) && anatomicalNote ? ' ' : ''}${anatomicalNote}

CURRENT ACL RISK PRIOR (0-100, 0 means unknown): ${currentAclRisk}

Output only JSON, no extra text.`;

  // Call Gemini API
  let geminiResult: { workloadManagement: number; mentalRecovery: number; aclRisk?: number; note?: string } | null = null;

  console.log(prompt);

  try {
    const resp = await fetch(env.GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' }
      }),
    });
    const data = await resp.json();
    console.log(data);
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text as string | undefined;
    if (text) {
      // Support fenced JSON output like ```json\n{...}\n```
      const fence = text.match(/```(?:json)?\n([\s\S]*?)\n```/i);
      const maybeJson = fence ? fence[1].trim() : text.trim();
      try {
        const parsed = JSON.parse(maybeJson);
        const wm = Math.max(1, Math.min(10, Math.round(Number(parsed.workloadManagement))));
        const mr = Math.max(1, Math.min(10, Math.round(Number(parsed.mentalRecovery))));
        const acl = parsed.aclRisk !== undefined ? Math.max(1, Math.min(100, Math.round(Number(parsed.aclRisk)))) : undefined;
        const note = typeof parsed.note === 'string' ? parsed.note : (typeof parsed.recommendation === 'string' ? parsed.recommendation : undefined);
        geminiResult = { workloadManagement: wm, mentalRecovery: mr, aclRisk: acl, note };
      } catch {
        // If model returns non-JSON, attempt simple extraction or fallback
        const wmMatch = text.match(/"workloadManagement"\s*:\s*(\d{1,2})/i) || text.match(/workloadManagement\D(\d{1,2})/i);
        const mrMatch = text.match(/"mentalRecovery"\s*:\s*(\d{1,2})/i) || text.match(/mentalRecovery\D(\d{1,2})/i);
        const aclMatch = text.match(/"aclRisk"\s*:\s*(\d{1,3})/i) || text.match(/aclRisk\D(\d{1,3})/i);
        const noteMatch = text.match(/"note"\s*:\s*"([^"\n]+)"/i) || text.match(/"recommendation"\s*:\s*"([^"\n]+)"/i);
        const wm = wmMatch ? Math.max(1, Math.min(10, Number(wmMatch[1]))) : 5;
        const mr = mrMatch ? Math.max(1, Math.min(10, Number(mrMatch[1]))) : 5;
        const acl = aclMatch ? Math.max(1, Math.min(100, Number(aclMatch[1]))) : undefined;
        const note = noteMatch ? noteMatch[1] : undefined;
        geminiResult = { workloadManagement: wm, mentalRecovery: mr, aclRisk: acl, note: note || text.slice(0, 300) };
      }
    }
  } catch (err) {
    console.error('Gemini API error:', err);
  }

  // Persist Gemini outputs into RiskFactor per-metric arrays (avoid duplicate same-day entries)
  let riskFactorEntry: any = null;
  if (geminiResult) {
    try {
      const rfDoc = await RiskFactor.findOrCreateByAthleteId(user.id);
      // Use the report's date rather than "today" to avoid blocking backfills
      const entryDate = report!.date || new Date();
      const entryDateStr = new Date(entryDate).toDateString();
      const hasReportDateDaily = (
        (rfDoc.workloadManagement || []).some((e: any) => e.reportType === 'daily' && new Date(e.date).toDateString() === entryDateStr) ||
        (rfDoc.mentalRecovery || []).some((e: any) => e.reportType === 'daily' && new Date(e.date).toDateString() === entryDateStr)
      );
      console.log(geminiResult, 'RESULTT');
      if (!hasReportDateDaily) {
        rfDoc.workloadManagement.push({ value: geminiResult.workloadManagement, date: entryDate, reportType: 'daily' });
        rfDoc.mentalRecovery.push({ value: geminiResult.mentalRecovery, date: entryDate, reportType: 'daily' });
        if ((geminiResult as any).note) {
          rfDoc.notes.push({ value: (geminiResult as any).note, date: entryDate });
        }
        await rfDoc.save();
        riskFactorEntry = {
          workloadManagement: rfDoc.workloadManagement.slice(-1)[0],
          mentalRecovery: rfDoc.mentalRecovery.slice(-1)[0],
          note: (rfDoc.notes || []).slice(-1)[0] || undefined,
        };
      }
    } catch (e) {
      console.error('Failed to persist RiskFactor entry:', e);
    }
  }

  // Update user's aclRisk if provided by Gemini
  if (geminiResult?.aclRisk !== undefined && Number.isFinite(geminiResult.aclRisk)) {
    try {
      await User.findByIdAndUpdate(user.id, { $set: { aclRisk: geminiResult.aclRisk } });
    } catch (e) {
      console.error('Failed to update user aclRisk:', e);
    }
  }

  return res.status(201).json({ report, risk, aiFactors: geminiResult || undefined, riskFactorEntry: riskFactorEntry || undefined });

});

// Get a specific report by date
router.get('/date/:date', requireAuth, async (req: Request, res: Response) => {
  const user = (req as any).user;
  const athleteId = (req.query.athleteId as string) || user.id;
  const requestedDate = new Date(req.params.date);

  // Try new schema first
  const athleteReports = await AthleteReports.findOne({ athleteId });

  if (athleteReports) {
    const report = athleteReports.dailyReports.find(
      r => r.date.toDateString() === requestedDate.toDateString()
    );
    return res.json({ report: report || null });
  } else {
    // Fallback to old schema
    const report = await DailyReport.findOne({
      athleteId,
      date: {
        $gte: new Date(requestedDate.setHours(0, 0, 0, 0)),
        $lt: new Date(requestedDate.setHours(23, 59, 59, 999))
      }
    });
    return res.json({ report });
  }
});

export default router;
