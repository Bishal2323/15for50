import { Router, Request, Response } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { RiskScore } from '../models/riskScore.model';
import { User } from '../models/user.model';
import { Notification } from '../models/notification.model';
import { CoachWeeklyReports } from '../models/coachWeeklyReport.model';
import bcrypt from 'bcryptjs';

const router = Router();

router.get('/team-dashboard', requireAuth, requireRole(['Coach', 'Physiotherapist']), async (_req: Request, res: Response) => {
  const latestByAthlete = await RiskScore.aggregate([
    { $sort: { date: -1 } },
    { $group: { _id: '$athleteId', latest: { $first: '$$ROOT' } } },
  ]);
  return res.json({ athletes: (latestByAthlete as any[]).map((a: any) => ({ athleteId: a._id, level: a.latest.level, score: a.latest.score })) });
});

// List athletes assigned to the authenticated coach
router.get('/athletes', requireAuth, requireRole('Coach'), async (req: Request, res: Response) => {
  try {
    const coachId = (req as any).user?.id;
    if (!coachId) return res.status(401).json({ error: 'Unauthorized' });
    const athletes = await User.find({ role: 'Athlete', coachId }).select('-passwordHash').sort({ createdAt: -1 });
    res.json({ athletes });
  } catch (error) {
    console.error('Error fetching coach athletes:', error);
    res.status(500).json({ error: 'Failed to fetch athletes' });
  }
});

// Send an invite to an existing athlete by email (no immediate assignment)
router.post('/athletes', requireAuth, requireRole('Coach'), async (req: Request, res: Response) => {
  try {
    const coachId = (req as any).user?.id;
    if (!coachId) return res.status(401).json({ error: 'Unauthorized' });

    const { email } = req.body || {};
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const coach = await User.findById(coachId).select('name');
    const athlete = await User.findOne({ email }).select('-passwordHash');
    if (!athlete || athlete.role !== 'Athlete') {
      return res.status(404).json({ error: 'Athlete not found' });
    }

    // Prevent inviting athletes who are already assigned to a coach
    if (athlete.coachId) {
      return res.status(400).json({ error: 'Athlete already assigned to a coach' });
    }

    // Avoid creating duplicate pending invitations for the same coach-athlete pair
    const existingPending = await Notification.findOne({
      recipientUserId: athlete._id,
      senderUserId: coachId,
      type: 'CoachInvite',
      status: 'pending',
    });
    if (existingPending) {
      return res.status(200).json({ notification: existingPending, message: 'Existing pending invite found' });
    }

    // Create a pending notification for athlete to accept coach invitation
    const notification = await Notification.create({
      recipientUserId: athlete._id,
      senderUserId: coachId,
      type: 'CoachInvite',
      status: 'pending',
      message: coach?.name ? `${coach.name} invites you to join their roster` : 'Coach invites you to join their roster',
      metadata: { coachId, athleteId: athlete._id },
    });

    return res.status(201).json({ notification, message: 'Invitation sent and pending athlete approval' });
  } catch (error) {
    console.error('Error creating athlete:', error);
    return res.status(500).json({ error: 'Failed to send invite' });
  }
});

// Assign the authenticated coach to an athlete
router.post('/athletes/:athleteId/assign', requireAuth, requireRole('Coach'), async (req: Request, res: Response) => {
  try {
    const coachId = (req as any).user?.id;
    if (!coachId) return res.status(401).json({ error: 'Unauthorized' });
    const athleteId = req.params.athleteId;

    const coach = await User.findById(coachId).select('name');
    const athlete = await User.findById(athleteId).select('-passwordHash');
    if (!athlete || athlete.role !== 'Athlete') {
      return res.status(404).json({ error: 'Athlete not found' });
    }

    // Prevent inviting athletes who are already assigned to a coach
    if (athlete.coachId) {
      return res.status(400).json({ error: 'Athlete already assigned to a coach' });
    }

    // Avoid creating duplicate pending invitations for same coach-athlete pair
    const existingPending = await Notification.findOne({
      recipientUserId: athleteId,
      senderUserId: coachId,
      type: 'CoachInvite',
      status: 'pending',
    });
    if (existingPending) {
      return res.status(200).json({ notification: existingPending, message: 'Existing pending invite found' });
    }

    // Create a pending notification for athlete to accept coach invitation
    const notification = await Notification.create({
      recipientUserId: athleteId,
      senderUserId: coachId,
      type: 'CoachInvite',
      status: 'pending',
      message: coach?.name ? `${coach.name} invites you to join their roster` : 'Coach invites you to join their roster',
      metadata: { coachId, athleteId },
    });

    res.status(201).json({ notification, message: 'Invitation sent and pending athlete approval' });
  } catch (error) {
    console.error('Error creating invitation:', error);
    res.status(500).json({ error: 'Failed to create invitation' });
  }
});

// Unassign the authenticated coach from an athlete
router.delete('/athletes/:athleteId/assign', requireAuth, requireRole('Coach'), async (req: Request, res: Response) => {
  try {
    const coachId = (req as any).user?.id;
    if (!coachId) return res.status(401).json({ error: 'Unauthorized' });
    const athleteId = req.params.athleteId;

    const athlete = await User.findById(athleteId).select('-passwordHash');
    if (!athlete || athlete.role !== 'Athlete') {
      return res.status(404).json({ error: 'Athlete not found' });
    }

    if (String(athlete.coachId || '') !== String(coachId)) {
      return res.status(400).json({ error: 'Athlete not assigned to this coach' });
    }

    athlete.coachId = null as any;
    await athlete.save();
    res.json({ athlete, message: 'Athlete unassigned from coach' });
  } catch (error) {
    console.error('Error unassigning athlete:', error);
    res.status(500).json({ error: 'Failed to unassign athlete' });
  }
});

// Weekly Reports: List all weekly reports for current coach
router.get('/weekly-reports', requireAuth, requireRole('Coach'), async (req: Request, res: Response) => {
  try {
    const coachId = (req as any).user?.id;
    if (!coachId) return res.status(401).json({ error: 'Unauthorized' });

    const { from, to } = req.query as { from?: string; to?: string };
    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;

    // Find athletes assigned to this coach
    const athletes = await User.find({ role: 'Athlete', coachId }).select('_id email name');
    const athleteIds = athletes.map(a => a._id);

    // Fetch per-athlete weekly reports documents
    const docs = await CoachWeeklyReports.find({ athleteId: { $in: athleteIds } }).lean();

    // Flatten coachMetrics entries and apply optional date filtering
    const reports = docs.flatMap(doc => (doc.coachMetrics || []).filter((entry: any) => {
      const ws = new Date(entry.weekStart);
      const we = new Date(entry.weekEnd);
      const afterFrom = fromDate ? ws >= fromDate : true;
      const beforeTo = toDate ? we <= toDate : true;
      return afterFrom && beforeTo;
    }).map((entry: any) => ({
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
    reports.sort((a: any, b: any) => new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime());

    // Attach basic athlete info
    const athleteInfoMap = new Map(athletes.map(a => [String(a._id), { email: a.email, name: a.name }]));
    const enriched = reports.map(r => ({
      ...r,
      athlete: athleteInfoMap.get(String(r.athleteId)) || undefined,
    }));

    return res.json({ reports: enriched });
  } catch (error) {
    console.error('Error fetching weekly reports:', error);
    return res.status(500).json({ error: 'Failed to fetch weekly reports' });
  }
});

// Weekly Reports: Create a weekly report for current coach
router.post('/weekly-reports', requireAuth, requireRole('Coach'), async (req: Request, res: Response) => {
  try {
    const coach = (req as any).user;
    if (!coach?.id) return res.status(401).json({ error: 'Unauthorized' });

    const payload = req.body || {};
    const weekStart = payload.weekStart ? new Date(payload.weekStart) : null;
    const weekEnd = payload.weekEnd ? new Date(payload.weekEnd) : null;
    if (!weekStart) {
      return res.status(400).json({ error: 'weekStart is required (YYYY-MM-DD)' });
    }

    // Default weekEnd to weekStart + 6 days if not provided
    const computedWeekEnd = weekEnd || new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);

    // Resolve athleteEmail -> athleteId for this weekly report
    const athleteEmail: string | undefined = payload.athleteEmail;
    let athleteId: any = payload.athleteId;
    if (!athleteId) {
      if (!athleteEmail) {
        return res.status(400).json({ error: 'athleteEmail is required' });
      }
      const athlete = await User.findOne({ email: athleteEmail });
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
    let doc = await CoachWeeklyReports.findOne({ athleteId });
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
    } as any;

    if (!doc) {
      doc = await CoachWeeklyReports.create({ athleteId, coachMetrics: [entry] });
    } else {
      doc.coachMetrics.push(entry);
      await doc.save();
    }

    const created = (doc.coachMetrics || []).slice(-1)[0];
    return res.status(201).json({ report: { ...created, athleteId }, message: 'Weekly report created' });
  } catch (error) {
    console.error('Error creating weekly report:', error);
    return res.status(500).json({ error: 'Failed to create weekly report' });
  }
});

// Weekly Reports: Get single report by id (ensure ownership)
router.get('/weekly-reports/:id', requireAuth, requireRole('Coach'), async (req: Request, res: Response) => {
  try {
    const coachId = (req as any).user?.id;
    if (!coachId) return res.status(401).json({ error: 'Unauthorized' });
    const id = req.params.id;

    // Allowed athletes for this coach
    const athletes = await User.find({ role: 'Athlete', coachId }).select('_id email name');
    const athleteIds = athletes.map(a => a._id);

    // Find document containing the subdocument id
    const doc = await CoachWeeklyReports.findOne({ athleteId: { $in: athleteIds }, 'coachMetrics._id': id }).lean();
    if (!doc) return res.status(404).json({ error: 'Report not found' });
    const entry = (doc.coachMetrics || []).find((e: any) => String(e._id) === String(id));
    if (!entry) return res.status(404).json({ error: 'Report not found' });

    const athlete = athletes.find(a => String(a._id) === String(doc.athleteId));
    return res.json({ report: { ...entry, athleteId: doc.athleteId, athlete: athlete ? { email: athlete.email, name: athlete.name } : undefined } });
  } catch (error) {
    console.error('Error fetching weekly report:', error);
    return res.status(500).json({ error: 'Failed to fetch weekly report' });
  }
});

export default router;
