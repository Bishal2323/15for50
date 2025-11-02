import { Router, Request, Response } from 'express';
import { RiskScore } from '../models/riskScore.model';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/history', requireAuth, async (req: Request, res: Response) => {
  const user = (req as any).user;
  const scores = await RiskScore.find({ athleteId: user.id }).sort({ date: 1 });
  return res.json({ scores });
});

export default router;