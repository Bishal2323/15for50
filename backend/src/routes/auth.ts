import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';
import { User } from '../models/user.model';
import { loadEnv } from '../setup/env';
import { requireAuth } from '../middleware/auth';

const env = loadEnv();
const router = Router();

router.post('/signup', async (req: Request, res: Response) => {
  const { email, password, role } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
  if (role && !['Athlete', 'Coach', 'Physiotherapist', 'Admin'].includes(role)) return res.status(400).json({ error: 'Invalid role' });

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ error: 'Email already registered' });

  const user = await User.create({
    email,
    role: role,
    teamId: undefined,
    passwordHash: await bcrypt.hash(password, 10),
  });

  const payload = { id: user.id, email: user.email, role: user.role };
  const secret = env.JWT_SECRET as Secret;
  const options = { expiresIn: env.JWT_EXPIRES_IN } as SignOptions;
  const token = jwt.sign(payload, secret, options);
  return res.status(201).json({ access_token: token, user: { id: user.id, email: user.email, role: user.role, } });
});

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const payload = { id: user.id, email: user.email, role: user.role };
  const secret = env.JWT_SECRET as Secret;
  const expiresInVal = /^\d+(?:\.\d+)?$/.test(env.JWT_EXPIRES_IN)
    ? Number(env.JWT_EXPIRES_IN)
    : env.JWT_EXPIRES_IN;
  const options: SignOptions = { expiresIn: expiresInVal as any };
  const token = jwt.sign(payload, secret, options);
  return res.json({ access_token: token, user: { id: user.id, name: user.name, email: user.email, role: user.role, gender: user.gender } });
});

// Athlete onboarding: optionally capture height/weight/name/gender and compute BMI
router.post('/onboarding', requireAuth, async (req: Request, res: Response) => {
  try {
    const requester = (req as any).user;
    if (!requester) return res.status(401).json({ error: 'Unauthorized' });
    if (requester.role !== 'Athlete') return res.status(403).json({ error: 'Forbidden: only athletes can onboard' });

    const { heightCm, weightKg, heightInches, weightPounds, name, gender, age } = req.body || {};
    const updates: any = {};

    if (typeof name === 'string') updates.name = name;
    if (gender && ['male', 'female'].includes(String(gender))) updates.gender = gender;
    const ageNum = Number(age);
    if (!Number.isNaN(ageNum) && ageNum > 0) updates.age = ageNum;

    // Accept either metric or imperial values; convert imperial to metric
    let h = Number(heightCm);
    let w = Number(weightKg);
    const hin = Number(heightInches);
    const wp = Number(weightPounds);
    if (!Number.isNaN(hin) && hin > 0 && (Number.isNaN(h) || h <= 0)) {
      // 1 inch = 2.54 cm
      h = hin * 2.54;
    }
    if (!Number.isNaN(wp) && wp > 0 && (Number.isNaN(w) || w <= 0)) {
      // 1 lb = 0.453592 kg
      w = wp * 0.453592;
    }
    if (!Number.isNaN(h) && h > 0) updates.heightCm = h;
    if (!Number.isNaN(w) && w > 0) updates.weightKg = w;
    if (updates.heightCm && updates.weightKg) {
      const heightM = updates.heightCm / 100;
      const bmi = updates.weightKg / (heightM * heightM);
      updates.bmi = Math.round(bmi * 10) / 10;
    }

    const user = await User.findByIdAndUpdate(requester.id, { $set: updates }, { new: true }).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ message: 'Onboarding completed', user });
  } catch (error) {
    console.error('Error during onboarding:', error);
    return res.status(500).json({ error: 'Failed to complete onboarding' });
  }
});

// Update profile: allow editing core fields and recompute BMI
router.post('/update-profile', requireAuth, async (req: Request, res: Response) => {
  try {
    const requester = (req as any).user;
    if (!requester) return res.status(401).json({ error: 'Unauthorized' });

    const { name, gender, age, heightCm, weightKg } = req.body || {};
    const updates: any = {};

    if (typeof name === 'string') updates.name = name;
    if (gender && ['male', 'female'].includes(String(gender))) updates.gender = gender;
    const ageNum = Number(age);
    if (!Number.isNaN(ageNum) && ageNum > 0) updates.age = ageNum;

    const h = Number(heightCm);
    const w = Number(weightKg);
    if (!Number.isNaN(h) && h > 0) updates.heightCm = h;
    if (!Number.isNaN(w) && w > 0) updates.weightKg = w;
    if (updates.heightCm && updates.weightKg) {
      const heightM = updates.heightCm / 100;
      const bmi = updates.weightKg / (heightM * heightM);
      updates.bmi = Math.round(bmi * 10) / 10;
    }

    const user = await User.findByIdAndUpdate(requester.id, { $set: updates }, { new: true }).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ message: 'Profile updated', user });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;
