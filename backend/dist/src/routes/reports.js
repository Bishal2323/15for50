"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dailyReport_model_1 = require("../models/dailyReport.model");
const riskScore_model_1 = require("../models/riskScore.model");
const auth_1 = require("../middleware/auth");
const risk_1 = require("../services/risk");
const router = (0, express_1.Router)();
router.get('/', auth_1.requireAuth, async (req, res) => {
    const user = req.user;
    const athleteId = req.query.athleteId || user.id;
    const reports = await dailyReport_model_1.DailyReport.find({ athleteId }).sort({ date: 1 });
    return res.json({ reports });
});
router.post('/', auth_1.requireAuth, async (req, res) => {
    const user = req.user;
    const payload = req.body;
    const report = await dailyReport_model_1.DailyReport.create({
        athleteId: user.id,
        date: new Date(),
        trainingDuration: payload.trainingDuration,
        fatigueLevel: payload.fatigueLevel,
        sleepHours: payload.sleepHours,
        kneeStabilityL: payload.kneeStabilityL,
        kneeStabilityR: payload.kneeStabilityR,
        comments: payload.comments,
    });
    const reports = await dailyReport_model_1.DailyReport.find({ athleteId: user.id }).sort({ date: 1 });
    const metrics = reports.map((r) => ({
        trainingDuration: r.trainingDuration,
        fatigueLevel: r.fatigueLevel,
        sleepHours: r.sleepHours,
        kneeStabilityL: r.kneeStabilityL,
        kneeStabilityR: r.kneeStabilityR,
    }));
    const risk = (0, risk_1.computeRisk)(metrics);
    await riskScore_model_1.RiskScore.create({ athleteId: user.id, date: report.date, ...risk });
    return res.status(201).json({ report, risk });
});
exports.default = router;
//# sourceMappingURL=reports.js.map