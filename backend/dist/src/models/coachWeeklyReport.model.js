"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoachWeeklyReports = void 0;
const mongoose_1 = require("mongoose");
// Report entry subdocument containing all relevant weekly metrics and metadata
const ReportEntrySchema = new mongoose_1.Schema({
    // Week window
    weekStart: { type: Date, required: true },
    weekEnd: { type: Date, required: true },
    // Optional metadata
    title: { type: String },
    trainingFocus: { type: String },
    // Summary sections
    highlights: [{ type: String }],
    concerns: [{ type: String }],
    actionItems: [{ type: String }],
    notes: { type: String },
    // Coach-entered factors and performance metrics for the week
    metrics: {
        acwr: { type: Number, min: 0, max: 3 },
        quadricepsLsi: { type: Number, min: 0, max: 150 },
        hamstringsLsi: { type: Number, min: 0, max: 150 },
        singleLegHopLsi: { type: Number, min: 0, max: 150 },
        yBalanceAnteriorDiffCm: { type: Number, min: 0, max: 50 },
        lessScore: { type: Number, min: 0, max: 20 },
        slsStabilitySec: { type: Number, min: 0, max: 300 },
        specificPainChecks: [{ area: { type: String }, rating: { type: Number, min: 0, max: 10 } }],
    },
    // Aggregated metrics for the week (optional)
    aggregated: {
        avgTrainingLoadSRPE: { type: Number, min: 0 },
        avgSleepQuality: { type: Number, min: 0, max: 10 },
        avgMood: { type: Number, min: 0, max: 10 },
        athleteCount: { type: Number, min: 0 },
    },
}, { _id: true });
// Main collection: one document per athleteId, with nested array of report entries
const CoachWeeklyReportsSchema = new mongoose_1.Schema({
    athleteId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    coachMetrics: [ReportEntrySchema],
}, { timestamps: true });
// Unique document per athleteId is enforced via the field's unique constraint
exports.CoachWeeklyReports = (0, mongoose_1.model)('CoachWeeklyReports', CoachWeeklyReportsSchema);
//# sourceMappingURL=coachWeeklyReport.model.js.map