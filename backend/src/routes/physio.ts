import { Router, Request, Response } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { User } from '../models/user.model';
import { PhysioReports } from '../models/physioReport.model';
import { RiskFactor } from '../models/riskFactor.model';
import { loadEnv } from '../setup/env';

const router = Router();

// Physio middleware - require physiotherapist role for all routes
router.use(requireAuth);
router.use(requireRole('Physiotherapist'));

// Get users (non-admin) with optional search and role filter
router.get('/users', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const role = (req.query.role as string) || undefined;
    const search = (req.query.search as string) || undefined;
    const skip = (page - 1) * limit;

    // Build filter query; always exclude Admins
    const filter: any = { role: { $ne: 'Admin' } };
    if (role) {
      filter.role = role;
    }
    if (search) {
      filter.email = { $regex: search, $options: 'i' };
    }

    const users = await User.find(filter)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await User.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    return res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching users for physio:', error);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router;

// List physio reports for current physiotherapist (optionally filter by athlete and date range)
router.get('/reports', async (req: Request, res: Response) => {
  try {
    const requester = (req as any).user;
    const { athleteId, from, to } = req.query as { athleteId?: string; from?: string; to?: string };
    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;

    const baseFilter: any = athleteId ? { athleteId } : {};
    const docs = await PhysioReports.find(baseFilter)
      .sort({ updatedAt: -1 })
      .populate('athleteId', 'email name')
      .lean();

    const reports = docs.flatMap(doc => (doc.physioMetrics || [])
      .filter((entry: any) => {
        const ownerMatches = String(entry.physioId) === String(requester.id);
        const d = new Date(entry.reportDate);
        const afterFrom = fromDate ? d >= fromDate : true;
        const beforeTo = toDate ? d <= toDate : true;
        return ownerMatches && afterFrom && beforeTo;
      })
      .map((entry: any) => ({
        _id: entry._id,
        athleteId: doc.athleteId,
        athlete: (doc as any).athleteId || undefined,
        reportDate: entry.reportDate,
        version: entry.version,
        physioId: entry.physioId,
        metrics: entry.metrics,
        assessment: entry.assessment,
        treatment: entry.treatment,
        notes: entry.notes,
      }))
    );

    reports.sort((a: any, b: any) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime());

    return res.json({ reports });
  } catch (error) {
    console.error('Error fetching physio reports:', error);
    return res.status(500).json({ error: 'Failed to fetch physio reports' });
  }
});

// Create a physio report for current physiotherapist
router.post('/reports', async (req: Request, res: Response) => {
  try {
    const env = loadEnv();
    const physio = (req as any).user;
    const payload = req.body || {};

    // Resolve athlete
    let athleteId: any = payload.athleteId;
    const athleteEmail: string | undefined = payload.athleteEmail;
    if (!athleteId) {
      if (!athleteEmail) {
        return res.status(400).json({ error: 'athleteId or athleteEmail is required' });
      }
      const athlete = await User.findOne({ email: athleteEmail });
      if (!athlete || athlete.role !== 'Athlete') {
        return res.status(404).json({ error: `Athlete not found for email ${athleteEmail}` });
      }
      athleteId = athlete._id;
    }

    const reportDate = payload.assessmentDate ? new Date(payload.assessmentDate) : null;
    if (!reportDate || Number.isNaN(reportDate.getTime())) {
      return res.status(400).json({ error: 'assessmentDate is required (YYYY-MM-DD)' });
    }

    // Basic payload validation for required metrics
    const requiredFields = [
      'hqRatio', 'peakDynamicKneeValgusDeg', 'trunkLeanLandingDeg', 'cmjPeakPowerWkg',
      'beightonScore', 'anatomicalRisk', 'mvicLsi', 'emgOnsetDelayMs',
    ];
    for (const f of requiredFields) {
      if (payload[f] === undefined || payload[f] === null) {
        return res.status(400).json({ error: `Missing required field: ${f}` });
      }
    }

    let doc = await PhysioReports.findOne({ athleteId });

    // Duplicate date check: prevent multiple entries for the same athlete by the same physio on the same date
    if (doc && Array.isArray(doc.physioMetrics)) {
      const isDuplicate = doc.physioMetrics.some((m: any) => {
        try {
          const d = new Date(m.reportDate);
          return new Date(d).toDateString() === new Date(reportDate).toDateString();
        } catch {
          return false;
        }
      });
      if (isDuplicate) {
        return res.status(409).json({
          error: 'Physio report already exists for this athlete on this date',
          date: reportDate.toISOString().slice(0, 10),
        });
      }
    }
    const entry = {
      physioId: physio.id,
      reportDate,
      version: payload.version || 1,
      metrics: {
        hqRatio: payload.hqRatio,
        peakDynamicKneeValgusDeg: payload.peakDynamicKneeValgusDeg,
        trunkLeanLandingDeg: payload.trunkLeanLandingDeg,
        cmjPeakPowerWkg: payload.cmjPeakPowerWkg,
        beightonScore: payload.beightonScore,
        anatomicalRisk: payload.anatomicalRisk,
        mvicLsi: payload.mvicLsi,
        emgOnsetDelayMs: payload.emgOnsetDelayMs,
      },
      assessment: {
        findings: payload.assessmentFindings || [],
        summary: payload.assessmentSummary,
        riskLevel: payload.assessmentRiskLevel,
      },
      treatment: {
        plan: payload.treatmentPlan,
        exercises: payload.exercises || [],
        modalities: payload.modalities || [],
        nextVisitDate: payload.nextVisitDate ? new Date(payload.nextVisitDate) : undefined,
      },
      notes: payload.notes,
    } as any;

    if (!doc) {
      doc = await PhysioReports.create({ athleteId, physioMetrics: [entry] });
    } else {
      doc.physioMetrics.push(entry);
      await doc.save();
    }

    const created = (doc.physioMetrics || []).slice(-1)[0];

    // Build previous physio averages (excluding current created entry)
    const prevEntries = (doc.physioMetrics || []).filter((e: any) => new Date(e.reportDate).toDateString() !== new Date(reportDate).toDateString());
    const avg = (arr: number[]) => {
      const vals = arr.filter(v => Number.isFinite(Number(v))).map(Number);
      return vals.length ? Number((vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(2)) : undefined;
    };
    const physioAverages = {
      hqRatio: avg(prevEntries.map((e: any) => e.metrics?.hqRatio)),
      peakDynamicKneeValgusDeg: avg(prevEntries.map((e: any) => e.metrics?.peakDynamicKneeValgusDeg)),
      trunkLeanLandingDeg: avg(prevEntries.map((e: any) => e.metrics?.trunkLeanLandingDeg)),
      cmjPeakPowerWkg: avg(prevEntries.map((e: any) => e.metrics?.cmjPeakPowerWkg)),
      beightonScore: avg(prevEntries.map((e: any) => e.metrics?.beightonScore)),
      mvicLsi: avg(prevEntries.map((e: any) => e.metrics?.mvicLsi)),
      emgOnsetDelayMs: avg(prevEntries.map((e: any) => e.metrics?.emgOnsetDelayMs)),
    };

    // RiskFactor averages for context
    const rfDoc = await RiskFactor.findOrCreateByAthleteId(athleteId);
    const avgMetric = (arr: Array<{ value: number }> = []) => {
      const vals = (arr || []).map(x => Number(x.value)).filter(v => Number.isFinite(v));
      return vals.length ? Math.round(vals.reduce((s, v) => s + v, 0) / vals.length) : 0;
    };
    const rfAverages = {
      workloadManagement: avgMetric(rfDoc.workloadManagement as any),
      mentalRecovery: avgMetric(rfDoc.mentalRecovery as any),
      strengthAsymmetry: avgMetric(rfDoc.strengthAsymmetry as any),
      neuromuscularControl: avgMetric(rfDoc.neuromuscularControl as any),
    };

    // Current ACL risk prior
    let currentAclRisk = 0;
    try {
      const dbAthlete = await User.findById(athleteId).lean();
      currentAclRisk = typeof dbAthlete?.aclRisk === 'number' ? dbAthlete.aclRisk! : 0;
    } catch { }

    // Prepare prompt for Gemini
    const prompt = `You are analyzing a physiotherapy assessment report for an athlete.

CURRENT REPORT DATE: ${reportDate.toISOString().slice(0, 10)}

CURRENT PHYSIO METRICS:
${JSON.stringify(entry.metrics)}

PREVIOUS PHYSIO REPORTS AVERAGES:
${JSON.stringify(physioAverages)}

RISK FACTOR AVERAGES (1-10 scales):
${JSON.stringify(rfAverages)}

CURRENT ACL RISK PRIOR (0-100, 0 means unknown): ${currentAclRisk}

WEIGHTING BREAKDOWN FOR ACL RISK (THIS PHYSIO ASSESSMENT):
- workloadManagement + mentalRecovery together constitute 20% of the ACL risk.
- strengthAsymmetry + neuromuscularControl together constitute 50% of the ACL risk.
- anatomicalRisk constitutes 30% of the ACL risk. Small deviations in anatomical metrics can significantly influence the ACL risk due to biomechanics.

Do NOT generalize 'risk factors'. Use ONLY the named categories above with the specified weights. Make conservative adjustments relative to the prior unless evidence is strong.

Return ONLY valid JSON with keys: { "anatomicalRisk": "Low" | "Moderate" | "High", "aclRisk": number, "note": string }.`;

    let aiResult: { anatomicalRisk?: string; aclRisk?: number; note?: string } | null = null;
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
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text as string | undefined;
      if (text) {
        const fence = text.match(/```(?:json)?\n([\s\S]*?)\n```/i);
        const maybeJson = fence ? fence[1].trim() : text.trim();
        try {
          const parsed = JSON.parse(maybeJson);
          const anat = typeof parsed.anatomicalRisk === 'string' ? parsed.anatomicalRisk : undefined;
          const acl = parsed.aclRisk !== undefined ? Math.max(1, Math.min(100, Math.round(Number(parsed.aclRisk)))) : undefined;
          const note = typeof parsed.note === 'string' ? parsed.note : undefined;
          aiResult = { anatomicalRisk: anat, aclRisk: acl, note };
        } catch {
          const anatMatch = text.match(/"anatomicalRisk"\s*:\s*"(Low|Moderate|High)"/i);
          const aclMatch = text.match(/"aclRisk"\s*:\s*(\d{1,3})/i) || text.match(/aclRisk\D(\d{1,3})/i);
          const noteMatch = text.match(/"note"\s*:\s*"([^"\n]+)"/i);
          const anat = anatMatch ? anatMatch[1] : undefined;
          const acl = aclMatch ? Math.max(1, Math.min(100, Number(aclMatch[1]))) : undefined;
          const note = noteMatch ? noteMatch[1] : undefined;
          aiResult = { anatomicalRisk: anat, aclRisk: acl, note: note || text.slice(0, 300) };
        }
      }
    } catch (err) {
      console.error('Gemini API error (physio):', err);
    }

    // If AI suggests anatomicalRisk, update the created physio entry
    if (aiResult?.anatomicalRisk) {
      try {
        if (created && created.metrics) {
          created.metrics.anatomicalRisk = aiResult.anatomicalRisk;
          await doc.save();
        }
      } catch (e) {
        console.error('Failed updating physio anatomicalRisk from AI:', e);
      }
    }

    // Persist anatomicalFixedRisk and note into RiskFactor with weekly-type and reportDate
    let riskFactorEntry: any = null;
    try {
      const entryDate = reportDate;
      const entryDateStr = new Date(entryDate).toDateString();
      const rfHasWeekly = (
        (rfDoc.anatomicalFixedRisk || []).some((e: any) => e.reportType === 'weekly' && new Date(e.date).toDateString() === entryDateStr)
      );
      if (!rfHasWeekly) {
        if (aiResult?.anatomicalRisk) {
          const map: Record<string, number> = { Low: 3, Moderate: 6, High: 9 };
          const val = map[(aiResult.anatomicalRisk || '').replace(/^(low|moderate|high)$/i, (m: string) => m.charAt(0).toUpperCase() + m.slice(1).toLowerCase())] || 5;
          rfDoc.anatomicalFixedRisk.push({ value: val, date: entryDate, reportType: 'weekly' });
        }
        if (aiResult?.note) {
          rfDoc.notes.push({ value: aiResult.note, date: entryDate });
        }
        await rfDoc.save();
        riskFactorEntry = {
          anatomicalFixedRisk: rfDoc.anatomicalFixedRisk.slice(-1)[0],
          note: (rfDoc.notes || []).slice(-1)[0] || undefined,
        };
      }
    } catch (e) {
      console.error('Failed to persist anatomicalFixedRisk:', e);
    }

    // Update athlete's aclRisk from AI
    if (aiResult?.aclRisk !== undefined && Number.isFinite(aiResult.aclRisk)) {
      try {
        await User.findByIdAndUpdate(athleteId, { $set: { aclRisk: aiResult.aclRisk } });
      } catch (e) {
        console.error('Failed to update athlete aclRisk (physio):', e);
      }
    }

    return res.status(201).json({ report: { ...created, athleteId }, aiFactors: aiResult || undefined, riskFactorEntry: riskFactorEntry || undefined, message: 'Physio report created' });
  } catch (error) {
    console.error('Error creating physio report:', error);
    return res.status(500).json({ error: 'Failed to create physio report' });
  }
});
