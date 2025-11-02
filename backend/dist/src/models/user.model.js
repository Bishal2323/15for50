"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['Athlete', 'Coach', 'Physiotherapist', 'Admin'], required: true },
    teamId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Team' },
    passwordHash: { type: String, required: true },
}, { timestamps: true });
exports.User = (0, mongoose_1.model)('User', UserSchema);
//# sourceMappingURL=user.model.js.map