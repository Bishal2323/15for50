import mongoose, { Types } from 'mongoose';
export interface IAuditLog {
    action: string;
    entityType: string;
    entityId: Types.ObjectId;
    actorId: Types.ObjectId;
    metadata?: Record<string, any>;
    createdAt: Date;
}
export declare const AuditLog: mongoose.Model<any, {}, {}, {}, any, any>;
