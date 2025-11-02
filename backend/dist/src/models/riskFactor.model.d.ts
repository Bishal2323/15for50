import mongoose, { Document, Model } from 'mongoose';
export type ReportType = 'daily' | 'weekly' | 'monthly';
export interface IRiskValue {
    value: number;
    date: Date;
    reportType: ReportType;
}
export interface IRiskFactor extends Document {
    athleteId: mongoose.Types.ObjectId;
    workloadManagement: IRiskValue[];
    mentalRecovery: IRiskValue[];
    strengthAsymmetry: IRiskValue[];
    neuromuscularControl: IRiskValue[];
    anatomicalFixedRisk: IRiskValue[];
    notes: INote[];
    createdAt: Date;
    updatedAt: Date;
}
export interface IRiskFactorModel extends Model<IRiskFactor> {
    findOrCreateByAthleteId(athleteId: mongoose.Types.ObjectId): Promise<IRiskFactor>;
}
export interface INote {
    value: string;
    date: Date;
}
export declare const RiskFactor: IRiskFactorModel;
