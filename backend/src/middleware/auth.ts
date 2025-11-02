import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { loadEnv } from '../setup/env';

const env = loadEnv();

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' });
  }
  const token = auth.slice('Bearer '.length);
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as any;
    (req as any).user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

type Role = 'Athlete' | 'Coach' | 'Physiotherapist' | 'Admin';

export function requireRole(role: Role | Role[]) {
  const allowed = Array.isArray(role) ? role : [role];
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: 'Missing user' });
    if (user.role === 'Admin') return next();
    if (!allowed.includes(user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}