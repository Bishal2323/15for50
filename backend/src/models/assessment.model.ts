import { Schema, model } from 'mongoose';

const AssessmentSchema = new Schema({
  athleteId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  hamstringStrength: { type: Number, min: 0, max: 100, required: true },
  quadStrength: { type: Number, min: 0, max: 100, required: true },
  mobility: { type: Number, min: 0, max: 100, required: true },
  videoUrl: { type: String },
}, { timestamps: true });

export const Assessment = model('Assessment', AssessmentSchema);