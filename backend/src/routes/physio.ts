import { Router, Request, Response } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { User } from '../models/user.model';
import { PhysioReports } from '../models/physioReport.model';

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
    return res.status(201).json({ report: { ...created, athleteId }, message: 'Physio report created' });
  } catch (error) {
    console.error('Error creating physio report:', error);
    return res.status(500).json({ error: 'Failed to create physio report' });
  }
});
