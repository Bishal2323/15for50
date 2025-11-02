"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyReport = exports.AthleteReports = void 0;
const mongoose_1 = require("mongoose");
// Individual daily report schema (embedded in the athlete's reports array)
const DailyReportEntrySchema = new mongoose_1.Schema({
    date: { type: Date, required: true },
    // Sleep & Recovery
    sleepHours: { type: Number, min: 0, max: 24, required: true },
    sleepQuality: { type: Number, min: 1, max: 10, required: true },
    // Physical State
    fatigueLevel: { type: Number, min: 0, max: 100, required: true },
    stressLevel: { type: Number, min: 0, max: 100, required: true },
    // Legacy pain fields removed from required set; kept optional for backward compatibility
    painLevel: { type: Number, min: 0, max: 10 },
    painAreas: [{ type: String }],
    jointStrain: { type: Number, min: 1, max: 10 },
    // Legacy local soreness removed from required set; kept optional for backward compatibility
    localSoreness: { type: Number, min: 0, max: 10 },
    readinessToTrain: { type: Number, min: 1, max: 10, required: true },
    // Mental State
    mood: { type: Number, min: 1, max: 10, required: true },
    nonSportStressors: { type: Number, min: 0, max: 100, required: true },
    nonSportStressorsNotes: { type: String },
    // Training (Optional)
    trainingIntensity: { type: Number, min: 0, max: 100 },
    trainingDuration: { type: Number, min: 0 },
    trainingRPE: { type: Number, min: 1, max: 10 },
    trainingLoadSRPE: { type: Number, min: 0 },
    // Female Athletes (Optional)
    menstrualStatus: {
        type: String,
        enum: ["None", "Menstruation", "Follicular", "Ovulation", "Luteal"]
    },
    // Body attributes (per body part) with nullable metrics
    bodyAttributes: {
        type: Map,
        of: new mongoose_1.Schema({
            soreness: { type: Number, min: 0, max: 10, default: null },
            redness: { type: Number, min: 0, max: 10, default: null },
            swelling: { type: Number, min: 0, max: 10, default: null },
            notes: { type: String },
        }, { _id: false })
    },
    // Legacy fields (keeping for backward compatibility)
    kneeStabilityL: { type: Number, min: 1, max: 10 },
    kneeStabilityR: { type: Number, min: 1, max: 10 },
    // General
    notes: { type: String },
    comments: { type: String }, // Legacy field
    // symptoms removed from new flow; keep optional for backward compatibility
    symptoms: [{ type: String }],
}, { timestamps: true, _id: true });
// Main athlete reports collection schema
const AthleteReportsSchema = new mongoose_1.Schema({
    athleteId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    dailyReports: [DailyReportEntrySchema]
}, { timestamps: true });
// Create indexes for efficient querying
// Unique document per athlete is enforced via the field's unique constraint
AthleteReportsSchema.index({ 'dailyReports.date': 1 });
AthleteReportsSchema.index({ athleteId: 1, 'dailyReports.date': 1 });
exports.AthleteReports = (0, mongoose_1.model)('AthleteReports', AthleteReportsSchema);
// Keep the old model for backward compatibility during migration
const DailyReportSchema = new mongoose_1.Schema({
    athleteId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    // Sleep & Recovery
    sleepHours: { type: Number, min: 0, max: 24, required: true },
    sleepQuality: { type: Number, min: 1, max: 10, required: true },
    // Physical State
    fatigueLevel: { type: Number, min: 0, max: 100, required: true },
    stressLevel: { type: Number, min: 0, max: 100, required: true },
    // Legacy pain fields removed from required set; kept optional for backward compatibility
    painLevel: { type: Number, min: 0, max: 10 },
    painAreas: [{ type: String }],
    jointStrain: { type: Number, min: 1, max: 10 },
    // Legacy local soreness removed from required set; kept optional for backward compatibility
    localSoreness: { type: Number, min: 0, max: 10 },
    readinessToTrain: { type: Number, min: 1, max: 10, required: true },
    // Mental State
    mood: { type: Number, min: 1, max: 10, required: true },
    nonSportStressors: { type: Number, min: 0, max: 100, required: true },
    nonSportStressorsNotes: { type: String },
    // Training (Optional)
    trainingIntensity: { type: Number, min: 0, max: 100 },
    trainingDuration: { type: Number, min: 0 },
    trainingRPE: { type: Number, min: 1, max: 10 },
    trainingLoadSRPE: { type: Number, min: 0 },
    // Female Athletes (Optional)
    menstrualStatus: {
        type: String,
        enum: ["None", "Menstruation", "Follicular", "Ovulation", "Luteal"]
    },
    // Body attributes (per body part) with nullable metrics
    bodyAttributes: {
        type: Map,
        of: new mongoose_1.Schema({
            soreness: { type: Number, min: 0, max: 10, default: null },
            redness: { type: Number, min: 0, max: 10, default: null },
            swelling: { type: Number, min: 0, max: 10, default: null },
            notes: { type: String },
        }, { _id: false })
    },
    // Legacy fields (keeping for backward compatibility)
    kneeStabilityL: { type: Number, min: 1, max: 10 },
    kneeStabilityR: { type: Number, min: 1, max: 10 },
    // General
    notes: { type: String },
    comments: { type: String }, // Legacy field
    // symptoms removed from new flow; keep optional for backward compatibility
    symptoms: [{ type: String }],
}, { timestamps: true });
exports.DailyReport = (0, mongoose_1.model)('DailyReport', DailyReportSchema);
//# sourceMappingURL=dailyReport.model.js.map