"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const riskScore_model_1 = require("../models/riskScore.model");
const notification_model_1 = require("../models/notification.model");
const coachWeeklyReport_model_1 = require("../models/coachWeeklyReport.model");
const riskFactor_model_1 = require("../models/riskFactor.model");
const env_1 = require("../setup/env");
const user_model_1 = require("../models/user.model");
const physioReport_model_1 = require("../models/physioReport.model");
const router = (0, express_1.Router)();
router.get('/team-dashboard', auth_1.requireAuth, (0, auth_1.requireRole)(['Coach', 'Physiotherapist']), async (_req, res) => {
    const latestByAthlete = await riskScore_model_1.RiskScore.aggregate([
        { $sort: { date: -1 } },
        { $group: { _id: '$athleteId', latest: { $first: '$$ROOT' } } },
    ]);
    return res.json({ athletes: latestByAthlete.map((a) => ({ athleteId: a._id, level: a.latest.level, score: a.latest.score })) });
});
// List athletes assigned to the authenticated coach
router.get('/athletes', auth_1.requireAuth, (0, auth_1.requireRole)('Coach'), async (req, res) => {
    try {
        const coachId = req.user?.id;
        if (!coachId)
            return res.status(401).json({ error: 'Unauthorized' });
        const athletes = await user_model_1.User.find({ role: 'Athlete', coachId }).select('-passwordHash').sort({ createdAt: -1 });
        res.json({ athletes });
    }
    catch (error) {
        console.error('Error fetching coach athletes:', error);
        res.status(500).json({ error: 'Failed to fetch athletes' });
    }
});
// Send an invite to an existing athlete by email (no immediate assignment)
router.post('/athletes', auth_1.requireAuth, (0, auth_1.requireRole)('Coach'), async (req, res) => {
    try {
        const coachId = req.user?.id;
        if (!coachId)
            return res.status(401).json({ error: 'Unauthorized' });
        const { email } = req.body || {};
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        const coach = await user_model_1.User.findById(coachId).select('name');
        const athlete = await user_model_1.User.findOne({ email }).select('-passwordHash');
        if (!athlete || athlete.role !== 'Athlete') {
            return res.status(404).json({ error: 'Athlete not found' });
        }
        // Prevent inviting athletes who are already assigned to a coach
        if (athlete.coachId) {
            return res.status(400).json({ error: 'Athlete already assigned to a coach' });
        }
        // Avoid creating duplicate pending invitations for the same coach-athlete pair
        const existingPending = await notification_model_1.Notification.findOne({
            recipientUserId: athlete._id,
            senderUserId: coachId,
            type: 'CoachInvite',
            status: 'pending',
        });
        if (existingPending) {
            return res.status(200).json({ notification: existingPending, message: 'Existing pending invite found' });
        }
        // Create a pending notification for athlete to accept coach invitation
        const notification = await notification_model_1.Notification.create({
            recipientUserId: athlete._id,
            senderUserId: coachId,
            type: 'CoachInvite',
            status: 'pending',
            message: coach?.name ? `${coach.name} invites you to join their roster` : 'Coach invites you to join their roster',
            metadata: { coachId, athleteId: athlete._id },
        });
        return res.status(201).json({ notification, message: 'Invitation sent and pending athlete approval' });
    }
    catch (error) {
        console.error('Error creating athlete:', error);
        return res.status(500).json({ error: 'Failed to send invite' });
    }
});
// Assign the authenticated coach to an athlete
router.post('/athletes/:athleteId/assign', auth_1.requireAuth, (0, auth_1.requireRole)('Coach'), async (req, res) => {
    try {
        const coachId = req.user?.id;
        if (!coachId)
            return res.status(401).json({ error: 'Unauthorized' });
        const athleteId = req.params.athleteId;
        const coach = await user_model_1.User.findById(coachId).select('name');
        const athlete = await user_model_1.User.findById(athleteId).select('-passwordHash');
        if (!athlete || athlete.role !== 'Athlete') {
            return res.status(404).json({ error: 'Athlete not found' });
        }
        // Prevent inviting athletes who are already assigned to a coach
        if (athlete.coachId) {
            return res.status(400).json({ error: 'Athlete already assigned to a coach' });
        }
        // Avoid creating duplicate pending invitations for same coach-athlete pair
        const existingPending = await notification_model_1.Notification.findOne({
            recipientUserId: athleteId,
            senderUserId: coachId,
            type: 'CoachInvite',
            status: 'pending',
        });
        if (existingPending) {
            return res.status(200).json({ notification: existingPending, message: 'Existing pending invite found' });
        }
        // Create a pending notification for athlete to accept coach invitation
        const notification = await notification_model_1.Notification.create({
            recipientUserId: athleteId,
            senderUserId: coachId,
            type: 'CoachInvite',
            status: 'pending',
            message: coach?.name ? `${coach.name} invites you to join their roster` : 'Coach invites you to join their roster',
            metadata: { coachId, athleteId },
        });
        res.status(201).json({ notification, message: 'Invitation sent and pending athlete approval' });
    }
    catch (error) {
        console.error('Error creating invitation:', error);
        res.status(500).json({ error: 'Failed to create invitation' });
    }
});
// Unassign the authenticated coach from an athlete
router.delete('/athletes/:athleteId/assign', auth_1.requireAuth, (0, auth_1.requireRole)('Coach'), async (req, res) => {
    try {
        const coachId = req.user?.id;
        if (!coachId)
            return res.status(401).json({ error: 'Unauthorized' });
        const athleteId = req.params.athleteId;
        const athlete = await user_model_1.User.findById(athleteId).select('-passwordHash');
        if (!athlete || athlete.role !== 'Athlete') {
            return res.status(404).json({ error: 'Athlete not found' });
        }
        if (String(athlete.coachId || '') !== String(coachId)) {
            return res.status(400).json({ error: 'Athlete not assigned to this coach' });
        }
        athlete.coachId = null;
        await athlete.save();
        res.json({ athlete, message: 'Athlete unassigned from coach' });
    }
    catch (error) {
        console.error('Error unassigning athlete:', error);
        res.status(500).json({ error: 'Failed to unassign athlete' });
    }
});
// Weekly Reports: List all weekly reports for current coach
router.get('/weekly-reports', auth_1.requireAuth, (0, auth_1.requireRole)('Coach'), async (req, res) => {
    try {
        const coachId = req.user?.id;
        if (!coachId)
            return res.status(401).json({ error: 'Unauthorized' });
        const { from, to } = req.query;
        const fromDate = from ? new Date(from) : undefined;
        const toDate = to ? new Date(to) : undefined;
        // Find athletes assigned to this coach
        const athletes = await user_model_1.User.find({ role: 'Athlete', coachId }).select('_id email name');
        const athleteIds = athletes.map(a => a._id);
        // Fetch per-athlete weekly reports documents
        const docs = await coachWeeklyReport_model_1.CoachWeeklyReports.find({ athleteId: { $in: athleteIds } }).lean();
        // Flatten coachMetrics entries and apply optional date filtering
        const reports = docs.flatMap(doc => (doc.coachMetrics || []).filter((entry) => {
            const ws = new Date(entry.weekStart);
            const we = new Date(entry.weekEnd);
            const afterFrom = fromDate ? ws >= fromDate : true;
            const beforeTo = toDate ? we <= toDate : true;
            return afterFrom && beforeTo;
        }).map((entry) => ({
            _id: entry._id,
            athleteId: doc.athleteId,
            weekStart: entry.weekStart,
            weekEnd: entry.weekEnd,
            title: entry.title,
            trainingFocus: entry.trainingFocus,
            highlights: entry.highlights,
            concerns: entry.concerns,
            actionItems: entry.actionItems,
            notes: entry.notes,
            coachMetrics: entry.metrics,
            aggregated: entry.aggregated,
        })));
        // Sort by weekStart descending
        reports.sort((a, b) => new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime());
        // Attach basic athlete info
        const athleteInfoMap = new Map(athletes.map(a => [String(a._id), { email: a.email, name: a.name }]));
        const enriched = reports.map(r => ({
            ...r,
            athlete: athleteInfoMap.get(String(r.athleteId)) || undefined,
        }));
        return res.json({ reports: enriched });
    }
    catch (error) {
        console.error('Error fetching weekly reports:', error);
        return res.status(500).json({ error: 'Failed to fetch weekly reports' });
    }
});
// Weekly Reports: Create a weekly report for current coach
router.post('/weekly-reports', auth_1.requireAuth, (0, auth_1.requireRole)('Coach'), async (req, res) => {
    try {
        const env = (0, env_1.loadEnv)();
        const coach = req.user;
        if (!coach?.id)
            return res.status(401).json({ error: 'Unauthorized' });
        const payload = req.body || {};
        const weekStart = payload.weekStart ? new Date(payload.weekStart) : null;
        const weekEnd = payload.weekEnd ? new Date(payload.weekEnd) : null;
        if (!weekStart) {
            return res.status(400).json({ error: 'weekStart is required (YYYY-MM-DD)' });
        }
        // Default weekEnd to weekStart + 6 days if not provided
        const computedWeekEnd = weekEnd || new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
        // Resolve athleteEmail -> athleteId for this weekly report
        const athleteEmail = payload.athleteEmail;
        let athleteId = payload.athleteId;
        if (!athleteId) {
            if (!athleteEmail) {
                return res.status(400).json({ error: 'athleteEmail is required' });
            }
            const athlete = await user_model_1.User.findOne({ email: athleteEmail });
            if (!athlete || athlete.role !== 'Athlete') {
                return res.status(404).json({ error: `Athlete not found for email ${athleteEmail}` });
            }
            // Ownership check: ensure athlete is assigned to this coach (if set)
            if (athlete.coachId && String(athlete.coachId) !== String(coach.id)) {
                return res.status(403).json({ error: `Athlete ${athleteEmail} not assigned to this coach` });
            }
            athleteId = athlete._id;
        }
        // Find or create the per-athlete weekly reports doc
        let doc = await coachWeeklyReport_model_1.CoachWeeklyReports.findOne({ athleteId });
        // Enforce one weekly report per athlete per week by checking range overlap
        if (doc && Array.isArray(doc.coachMetrics)) {
            const overlaps = doc.coachMetrics.some((m) => {
                try {
                    const s = new Date(m.weekStart);
                    const e = new Date(m.weekEnd || new Date(s.getTime() + 6 * 24 * 60 * 60 * 1000));
                    return s <= computedWeekEnd && e >= weekStart; // ranges overlap
                }
                catch {
                    return false;
                }
            });
            if (overlaps) {
                return res.status(409).json({
                    error: 'Weekly report already exists for this athlete in the specified week',
                    week: {
                        requested: { start: weekStart.toISOString(), end: computedWeekEnd.toISOString() }
                    }
                });
            }
        }
        const entry = {
            weekStart,
            weekEnd: computedWeekEnd,
            title: payload.title,
            trainingFocus: payload.trainingFocus,
            highlights: payload.highlights || [],
            concerns: payload.concerns || [],
            actionItems: payload.actionItems || [],
            notes: payload.notes,
            metrics: {
                acwr: payload.acwr,
                quadricepsLsi: payload.quadricepsLsi,
                hamstringsLsi: payload.hamstringsLsi,
                singleLegHopLsi: payload.singleLegHopLsi,
                yBalanceAnteriorDiffCm: payload.yBalanceAnteriorDiffCm,
                lessScore: payload.lessScore,
                slsStabilitySec: payload.slsStabilitySec,
                specificPainChecks: payload.specificPainChecks || [],
            },
            aggregated: payload.aggregated || undefined,
        };
        if (!doc) {
            doc = await coachWeeklyReport_model_1.CoachWeeklyReports.create({ athleteId, coachMetrics: [entry] });
        }
        else {
            doc.coachMetrics.push(entry);
            await doc.save();
        }
        const created = (doc.coachMetrics || []).slice(-1)[0];
        // Build averages from RiskFactor (workloadManagement, mentalRecovery)
        const rfDoc = await riskFactor_model_1.RiskFactor.findOrCreateByAthleteId(athleteId);
        const avg = (arr = []) => {
            if (!arr || arr.length === 0)
                return 0;
            return Math.round(arr.reduce((sum, e) => sum + (Number(e.value) || 0), 0) / arr.length);
        };
        const workloadAvg = avg(rfDoc.workloadManagement);
        const mentalAvg = avg(rfDoc.mentalRecovery);
        // Average past coach weekly metrics for context
        const coachEntries = (doc.coachMetrics || []).filter(Boolean);
        const coachMetricKeys = [
            'acwr', 'quadricepsLsi', 'hamstringsLsi', 'singleLegHopLsi', 'yBalanceAnteriorDiffCm', 'lessScore', 'slsStabilitySec'
        ];
        const coachMetricsAverage = {};
        for (const key of coachMetricKeys) {
            const values = coachEntries.map((e) => Number(e?.metrics?.[key] ?? NaN)).filter(v => Number.isFinite(v));
            coachMetricsAverage[key] = values.length ? Number((values.reduce((s, v) => s + v, 0) / values.length).toFixed(2)) : 0;
        }
        // Fetch current athlete ACL risk prior (null/undefined -> 0)
        let currentAclRisk = 0;
        try {
            const dbAthlete = await user_model_1.User.findById(athleteId).lean();
            currentAclRisk = typeof dbAthlete?.aclRisk === 'number' ? dbAthlete.aclRisk : 0;
        }
        catch { }
        // Pull latest physio anatomicalRisk if present
        let physioAnatomicalRiskText = '';
        try {
            const physioDoc = await physioReport_model_1.PhysioReports.findOne({ athleteId }).lean();
            const entries = (physioDoc?.physioMetrics || []).filter(Boolean);
            const sorted = entries.sort((a, b) => new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime());
            const latest = sorted.find((e) => e?.metrics?.anatomicalRisk);
            if (latest?.metrics?.anatomicalRisk) {
                const d = new Date(latest.reportDate).toISOString().slice(0, 10);
                physioAnatomicalRiskText = `PHYSIO ANATOMICAL RISK (30% weight): ${latest.metrics.anatomicalRisk} (from ${d}).`;
            }
            else {
                physioAnatomicalRiskText = `ANATOMICAL RISK (30% weight): No physio anatomical data available for this period. If data is present, incorporate it at 30% importance.`;
            }
        }
        catch {
            physioAnatomicalRiskText = `ANATOMICAL RISK (30% weight): No physio anatomical data available. If data is present, incorporate it at 30% importance.`;
        }
        // Prompt for Gemini
        const prompt = `You are analyzing a weekly ACL rehab training report for an athlete.

CURRENT WEEK WINDOW:
  weekStart: ${weekStart?.toISOString().slice(0, 10)}
  weekEnd: ${computedWeekEnd.toISOString().slice(0, 10)}

CURRENT WEEK COACH METRICS:
${JSON.stringify(entry.metrics)}

COACH AGGREGATED (provided, optional):
${JSON.stringify(entry.aggregated || {})}

HISTORICAL AVERAGES FROM RISK FACTORS:
  workloadManagementAvg (1-10): ${workloadAvg}
  mentalRecoveryAvg (1-10): ${mentalAvg}

PAST COACH METRICS AVERAGES:
${JSON.stringify(coachMetricsAverage)}

CURRENT ACL RISK PRIOR (0-100, 0 means unknown): ${currentAclRisk}

${physioAnatomicalRiskText}

WEIGHTING NOTE: For ACL risk this week, COACH METRICS AND CONTEXT ABOVE contribute about 50% of the final risk, and the remaining 50% is inferred from other signals (e.g., workload/mental averages, recovery indicators). You MAY skew from currentAclRisk if weekly values are off by a lot; otherwise prefer modest adjustments.

Using this context, estimate weekly values (1-10) for:
- strengthAsymmetry: overall strength balance asymmetry risk
- neuromuscularControl: movement control quality and stability risk
Also estimate weekly ACL reinjury risk percentage (1-100): "aclRisk".

Return ONLY valid JSON with keys: { "strengthAsymmetry": number, "neuromuscularControl": number, "aclRisk": number, "note": string }.`;
        let aiResult = null;
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
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
                const fence = text.match(/```(?:json)?\n([\s\S]*?)\n```/i);
                const maybeJson = fence ? fence[1].trim() : text.trim();
                try {
                    const parsed = JSON.parse(maybeJson);
                    const sa = Math.max(1, Math.min(10, Math.round(Number(parsed.strengthAsymmetry))));
                    const nc = Math.max(1, Math.min(10, Math.round(Number(parsed.neuromuscularControl))));
                    const acl = parsed.aclRisk !== undefined ? Math.max(1, Math.min(100, Math.round(Number(parsed.aclRisk)))) : undefined;
                    const note = typeof parsed.note === 'string' ? parsed.note : undefined;
                    aiResult = { strengthAsymmetry: sa, neuromuscularControl: nc, aclRisk: acl, note };
                }
                catch {
                    const saMatch = text.match(/"strengthAsymmetry"\s*:\s*(\d{1,2})/i) || text.match(/strengthAsymmetry\D(\d{1,2})/i);
                    const ncMatch = text.match(/"neuromuscularControl"\s*:\s*(\d{1,2})/i) || text.match(/neuromuscularControl\D(\d{1,2})/i);
                    const aclMatch = text.match(/"aclRisk"\s*:\s*(\d{1,3})/i) || text.match(/aclRisk\D(\d{1,3})/i);
                    const noteMatch = text.match(/"note"\s*:\s*"([^"\n]+)"/i);
                    const sa = saMatch ? Math.max(1, Math.min(10, Number(saMatch[1]))) : 5;
                    const nc = ncMatch ? Math.max(1, Math.min(10, Number(ncMatch[1]))) : 5;
                    const acl = aclMatch ? Math.max(1, Math.min(100, Number(aclMatch[1]))) : undefined;
                    const note = noteMatch ? noteMatch[1] : undefined;
                    aiResult = { strengthAsymmetry: sa, neuromuscularControl: nc, aclRisk: acl, note: note || text.slice(0, 300) };
                }
            }
        }
        catch (err) {
            console.error('Gemini API error (weekly):', err);
        }
        // Persist into RiskFactor weekly fields with reportDate (use weekEnd)
        let riskFactorEntry = null;
        if (aiResult) {
            try {
                const entryDate = computedWeekEnd;
                const entryDateStr = entryDate.toDateString();
                const hasWeekly = ((rfDoc.strengthAsymmetry || []).some((e) => e.reportType === 'weekly' && new Date(e.date).toDateString() === entryDateStr) ||
                    (rfDoc.neuromuscularControl || []).some((e) => e.reportType === 'weekly' && new Date(e.date).toDateString() === entryDateStr));
                if (!hasWeekly) {
                    rfDoc.strengthAsymmetry.push({ value: aiResult.strengthAsymmetry, date: entryDate, reportType: 'weekly' });
                    rfDoc.neuromuscularControl.push({ value: aiResult.neuromuscularControl, date: entryDate, reportType: 'weekly' });
                    if (aiResult.note) {
                        rfDoc.notes.push({ value: aiResult.note, date: entryDate });
                    }
                    await rfDoc.save();
                    riskFactorEntry = {
                        strengthAsymmetry: rfDoc.strengthAsymmetry.slice(-1)[0],
                        neuromuscularControl: rfDoc.neuromuscularControl.slice(-1)[0],
                        note: (rfDoc.notes || []).slice(-1)[0] || undefined,
                    };
                }
            }
            catch (e) {
                console.error('Failed to persist weekly RiskFactor entry:', e);
            }
        }
        // Update athlete's aclRisk if provided
        if (aiResult?.aclRisk !== undefined && Number.isFinite(aiResult.aclRisk)) {
            try {
                await user_model_1.User.findByIdAndUpdate(athleteId, { $set: { aclRisk: aiResult.aclRisk } });
            }
            catch (e) {
                console.error('Failed to update athlete aclRisk:', e);
            }
        }
        return res.status(201).json({ report: { ...created, athleteId }, aiFactors: aiResult || undefined, riskFactorEntry: riskFactorEntry || undefined, message: 'Weekly report created' });
    }
    catch (error) {
        console.error('Error creating weekly report:', error);
        return res.status(500).json({ error: 'Failed to create weekly report' });
    }
});
// Weekly Reports: Get single report by id (ensure ownership)
router.get('/weekly-reports/:id', auth_1.requireAuth, (0, auth_1.requireRole)('Coach'), async (req, res) => {
    try {
        const coachId = req.user?.id;
        if (!coachId)
            return res.status(401).json({ error: 'Unauthorized' });
        const id = req.params.id;
        // Allowed athletes for this coach
        const athletes = await user_model_1.User.find({ role: 'Athlete', coachId }).select('_id email name');
        const athleteIds = athletes.map(a => a._id);
        // Find document containing the subdocument id
        const doc = await coachWeeklyReport_model_1.CoachWeeklyReports.findOne({ athleteId: { $in: athleteIds }, 'coachMetrics._id': id }).lean();
        if (!doc)
            return res.status(404).json({ error: 'Report not found' });
        const entry = (doc.coachMetrics || []).find((e) => String(e._id) === String(id));
        if (!entry)
            return res.status(404).json({ error: 'Report not found' });
        const athlete = athletes.find(a => String(a._id) === String(doc.athleteId));
        return res.json({ report: { ...entry, athleteId: doc.athleteId, athlete: athlete ? { email: athlete.email, name: athlete.name } : undefined } });
    }
    catch (error) {
        console.error('Error fetching weekly report:', error);
        return res.status(500).json({ error: 'Failed to fetch weekly report' });
    }
});
exports.default = router;
//# sourceMappingURL=coach.js.map