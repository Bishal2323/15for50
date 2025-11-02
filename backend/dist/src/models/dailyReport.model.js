"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyReport = void 0;
const mongoose_1 = require("mongoose");
const DailyReportSchema = new mongoose_1.Schema({
    athleteId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    trainingDuration: { type: Number, required: true },
    fatigueLevel: { type: Number, min: 1, max: 10, required: true },
    sleepHours: { type: Number, min: 0, max: 24, required: true },
    kneeStabilityL: { type: Number, min: 1, max: 10, required: true },
    kneeStabilityR: { type: Number, min: 1, max: 10, required: true },
    comments: { type: String },
}, { timestamps: true });
exports.DailyReport = (0, mongoose_1.model)('DailyReport', DailyReportSchema);
//# sourceMappingURL=dailyReport.model.js.map