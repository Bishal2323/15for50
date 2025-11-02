import type { Request, Response, NextFunction } from 'express';
export declare function requireAuth(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
type Role = 'Athlete' | 'Coach' | 'Physiotherapist' | 'Admin';
export declare function requireRole(role: Role | Role[]): (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export {};
