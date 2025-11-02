import { Schema, model } from 'mongoose';

// Limit to prevent document crowding
const MAX_REPORTS_PER_ATHLETE = 1000;

// Subdocument: one entry per physio report
const PhysioReportEntrySchema = new Schema({
  // Ownership (who created/performed this assessment)
  physioId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

  // Metadata
  reportDate: { type: Date, required: true },
  version: { type: Number, min: 1, default: 1 },

  // Physiological metrics
  metrics: {
    hqRatio: { type: Number, min: 0, max: 200, required: true },
    peakDynamicKneeValgusDeg: { type: Number, min: 0, max: 90, required: true },
    trunkLeanLandingDeg: { type: Number, min: 0, max: 45, required: true },
    cmjPeakPowerWkg: { type: Number, min: 0, max: 100, required: true },
    beightonScore: { type: Number, min: 0, max: 9, required: true },
    anatomicalRisk: { type: String, required: true },
    mvicLsi: { type: Number, min: 0, max: 150, required: true },
    emgOnsetDelayMs: { type: Number, min: 0, max: 200, required: true },
  },

  // Assessment data
  assessment: {
    findings: [{ type: String }],
    summary: { type: String },
    riskLevel: { type: String, enum: ['Low', 'Moderate', 'High'] },
  },

  // Treatment details
  treatment: {
    plan: { type: String },
    exercises: [{ name: { type: String }, frequencyPerWeek: { type: Number, min: 0 }, notes: { type: String } }],
    modalities: [{ type: String }],
    nextVisitDate: { type: Date },
  },

  // Notes
  notes: { type: String },
}, { _id: true });

// Main collection: one document per athleteId, with nested array of physio reports
const PhysioReportsSchema = new Schema({
  athleteId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  physioMetrics: {
    type: [PhysioReportEntrySchema],
    required: true,
    validate: [
      (arr: any[]) => arr.length <= MAX_REPORTS_PER_ATHLETE,
      `Too many physio reports: max ${MAX_REPORTS_PER_ATHLETE}`,
    ],
  },
}, { timestamps: true });

// Indexing strategies
// Primary: unique per athleteId via field-level constraint
// Secondary: common queries
PhysioReportsSchema.index({ 'physioMetrics.reportDate': -1 });
PhysioReportsSchema.index({ 'physioMetrics.physioId': 1 });
// Compound indexes for frequent patterns
PhysioReportsSchema.index({ athleteId: 1, 'physioMetrics.reportDate': -1 });
PhysioReportsSchema.index({ athleteId: 1, 'physioMetrics.version': 1 });

// Document size management: keep last MAX entries
PhysioReportsSchema.pre('save', function (next) {
  // @ts-ignore - this refers to the document instance
  if (this.physioMetrics && this.physioMetrics.length > MAX_REPORTS_PER_ATHLETE) {
    // @ts-ignore
    this.physioMetrics = this.physioMetrics.slice(-MAX_REPORTS_PER_ATHLETE);
  }
  next();
});

export const PhysioReports = model('PhysioReports', PhysioReportsSchema);
