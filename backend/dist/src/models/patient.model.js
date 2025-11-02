"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Patient = void 0;
const mongoose_1 = require("mongoose");
const PatientSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    details: { type: String, default: '' },
    severity: { type: String, enum: ['small', 'middle', 'severe'], required: true },
    // Owner: physiotherapist who created/manages this patient record
    physioId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
exports.Patient = (0, mongoose_1.model)('Patient', PatientSchema);
//# sourceMappingURL=patient.model.js.map