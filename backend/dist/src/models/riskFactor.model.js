"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskFactor = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const NoteSchema = new mongoose_1.Schema({
    value: { type: String, required: true },
    date: { type: Date, required: true, index: true },
}, { _id: false });
const RiskValueSchema = new mongoose_1.Schema({
    value: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
        validate: { validator: Number.isInteger, message: 'Value must be an integer between 1-10' }
    },
    date: { type: Date, required: true, index: true },
    reportType: { type: String, required: true, enum: ['daily', 'weekly', 'monthly'], index: true },
}, { _id: false });
const MAX_VALUES_PER_METRIC = 1000;
const RiskFactorSchema = new mongoose_1.Schema({
    athleteId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    workloadManagement: { type: [RiskValueSchema], default: [] },
    mentalRecovery: { type: [RiskValueSchema], default: [] },
    strengthAsymmetry: { type: [RiskValueSchema], default: [] },
    neuromuscularControl: { type: [RiskValueSchema], default: [] },
    anatomicalFixedRisk: { type: [RiskValueSchema], default: [] },
    notes: { type: [NoteSchema], default: [] },
}, { timestamps: true, collection: 'riskfactors' });
RiskFactorSchema.index({ athleteId: 1 });
RiskFactorSchema.index({ athleteId: 1, 'workloadManagement.date': -1 });
RiskFactorSchema.index({ athleteId: 1, 'mentalRecovery.date': -1 });
RiskFactorSchema.index({ athleteId: 1, 'notes.date': -1 });
// Keep arrays bounded
RiskFactorSchema.pre('save', function (next) {
    const cap = (arr) => (arr.length > MAX_VALUES_PER_METRIC ? arr.slice(-MAX_VALUES_PER_METRIC) : arr);
    // @ts-ignore
    this.workloadManagement = cap(this.workloadManagement || []);
    // @ts-ignore
    this.mentalRecovery = cap(this.mentalRecovery || []);
    // @ts-ignore
    this.strengthAsymmetry = cap(this.strengthAsymmetry || []);
    // @ts-ignore
    this.neuromuscularControl = cap(this.neuromuscularControl || []);
    // @ts-ignore
    this.anatomicalFixedRisk = cap(this.anatomicalFixedRisk || []);
    // @ts-ignore
    this.notes = cap(this.notes || []);
    next();
});
RiskFactorSchema.statics.findOrCreateByAthleteId = async function (athleteId) {
    let doc = await this.findOne({ athleteId });
    if (!doc) {
        doc = new this({ athleteId });
        await doc.save();
    }
    return doc;
};
exports.RiskFactor = mongoose_1.default.model('RiskFactor', RiskFactorSchema);
//# sourceMappingURL=riskFactor.model.js.map