"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskScore = void 0;
const mongoose_1 = require("mongoose");
const RiskScoreSchema = new mongoose_1.Schema({
    athleteId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    level: { type: String, enum: ['Low', 'Moderate', 'High'], required: true },
    score: { type: Number, min: 0, max: 1, required: true },
    violations: [{ type: String }],
    recommendation: { type: String },
}, { timestamps: true });
exports.RiskScore = (0, mongoose_1.model)('RiskScore', RiskScoreSchema);
//# sourceMappingURL=riskScore.model.js.map