import mongoose, { Schema, Document, Model } from 'mongoose';

export type ReportType = 'daily' | 'weekly' | 'monthly';

export interface IRiskValue {
    value: number; // 1-10 scale
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

const NoteSchema = new Schema<INote>({
    value: { type: String, required: true },
    date: { type: Date, required: true, index: true },
}, { _id: false });

const RiskValueSchema = new Schema<IRiskValue>({
    value: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
        validate: { validator: Number.isInteger, message: 'Value must be an integer between 1-10' }
    },
    date: { type: Date, required: true, index: true },
    reportType: { type: String, required: true, enum: ['daily', 'weekly', 'monthly'], index: true },
}, { _id: false });

const MAX_VALUES_PER_METRIC = 1000;

const RiskFactorSchema = new Schema<IRiskFactor>({
    athleteId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    workloadManagement: { type: [RiskValueSchema], default: [] },
    mentalRecovery: { type: [RiskValueSchema], default: [] },
    strengthAsymmetry: { type: [RiskValueSchema], default: [] },
    neuromuscularControl: { type: [RiskValueSchema], default: [] },
    anatomicalFixedRisk: { type: [RiskValueSchema], default: [] },
    notes: { type: [NoteSchema], default: [] },
}, { timestamps: true, collection: 'riskfactors' });

RiskFactorSchema.index({ athleteId: 1 });
RiskFactorSchema.index({ athleteId: 1, 'workloadManagement.date': -1 });
RiskFactorSchema.index({ athleteId: 1, 'mentalRecovery.date': -1 });
RiskFactorSchema.index({ athleteId: 1, 'notes.date': -1 });

// Keep arrays bounded
RiskFactorSchema.pre('save', function (next) {
    const cap = (arr: IRiskValue[]) => (arr.length > MAX_VALUES_PER_METRIC ? arr.slice(-MAX_VALUES_PER_METRIC) : arr);
    // @ts-ignore
    this.workloadManagement = cap(this.workloadManagement || []);
    // @ts-ignore
    this.mentalRecovery = cap(this.mentalRecovery || []);
    // @ts-ignore
    this.strengthAsymmetry = cap(this.strengthAsymmetry || []);
    // @ts-ignore
    this.neuromuscularControl = cap(this.neuromuscularControl || []);
    // @ts-ignore
    this.anatomicalFixedRisk = cap(this.anatomicalFixedRisk || []);
    // @ts-ignore
    this.notes = cap(this.notes || []);
    next();
});

RiskFactorSchema.statics.findOrCreateByAthleteId = async function (athleteId: mongoose.Types.ObjectId) {
    let doc = await this.findOne({ athleteId });
    if (!doc) {
        doc = new this({ athleteId });
        await doc.save();
    }
    return doc;
};

export const RiskFactor = mongoose.model<IRiskFactor, IRiskFactorModel>('RiskFactor', RiskFactorSchema);
