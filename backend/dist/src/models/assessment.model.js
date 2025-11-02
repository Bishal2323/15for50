"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assessment = void 0;
const mongoose_1 = require("mongoose");
const AssessmentSchema = new mongoose_1.Schema({
    athleteId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    hamstringStrength: { type: Number, min: 0, max: 100, required: true },
    quadStrength: { type: Number, min: 0, max: 100, required: true },
    mobility: { type: Number, min: 0, max: 100, required: true },
    videoUrl: { type: String },
}, { timestamps: true });
exports.Assessment = (0, mongoose_1.model)('Assessment', AssessmentSchema);
//# sourceMappingURL=assessment.model.js.map