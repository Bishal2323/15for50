import type { Response } from 'express';
export declare function registerConnection(userId: string, res: Response): void;
export declare function removeConnection(userId: string): void;
export declare function broadcastToUser(userId: string, notification: any): void;
