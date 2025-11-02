"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    name: { type: String, default: '' },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['Athlete', 'Coach', 'Physiotherapist', 'Admin'], required: true },
    gender: { type: String, enum: ['male', 'female'] },
    age: { type: Number, min: 0 },
    // Optional physical attributes for athletes (set during onboarding)
    heightCm: { type: Number, min: 0 },
    weightKg: { type: Number, min: 0 },
    bmi: { type: Number, min: 0 },
    teamId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Team' },
    // Relation: for Athletes, coachId references their Coach user
    coachId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
    // Optional ACL reinjury risk percentage (1-100); computed via AI
    aclRisk: { type: Number, min: 1, max: 100, default: null },
    passwordHash: { type: String, required: true },
}, { timestamps: true });
exports.User = (0, mongoose_1.model)('User', UserSchema);
//# sourceMappingURL=user.model.js.map