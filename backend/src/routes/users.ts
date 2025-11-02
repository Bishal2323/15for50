import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';
import { User } from '../models/user.model';

const router = Router();

// Get current authenticated user's full profile
router.get('/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const requester = (req as any).user;
    const user = await User.findById(requester.id).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        teamId: user.teamId,
        gender: user.gender,
        age: user.age,
        heightCm: user.heightCm,
        weightKg: user.weightKg,
        bmi: user.bmi
      } 
    });
  } catch (error) {
    console.error('Error fetching current user:', error);
    return res.status(500).json({ error: 'Failed to fetch current user' });
  }
});

// Delete current authenticated user's account (Admins cannot self-delete here)
router.delete('/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const requester = (req as any).user;
    if (requester.role === 'Admin') {
      return res.status(400).json({ error: 'Admins cannot delete their own account' });
    }

    const user = await User.findByIdAndDelete(requester.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    return res.json({ message: 'Account deleted' });
  } catch (error) {
    console.error('Error deleting current user:', error);
    return res.status(500).json({ error: 'Failed to delete account' });
  }
});

export default router;
