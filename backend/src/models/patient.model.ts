import { Schema, model } from 'mongoose';

const PatientSchema = new Schema({
  name: { type: String, required: true },
  details: { type: String, default: '' },
  severity: { type: String, enum: ['small', 'middle', 'severe'], required: true },
  // Owner: physiotherapist who created/manages this patient record
  physioId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export const Patient = model('Patient', PatientSchema);

