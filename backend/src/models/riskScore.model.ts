import { Schema, model } from 'mongoose';

const RiskScoreSchema = new Schema({
  athleteId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  level: { type: String, enum: ['Low', 'Moderate', 'High'], required: true },
  score: { type: Number, min: 0, max: 1, required: true },
  violations: [{ type: String }],
  recommendation: { type: String },
}, { timestamps: true });

export const RiskScore = model('RiskScore', RiskScoreSchema);