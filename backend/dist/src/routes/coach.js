"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const riskScore_model_1 = require("../models/riskScore.model");
const router = (0, express_1.Router)();
router.get('/team-dashboard', auth_1.requireAuth, (0, auth_1.requireRole)(['Coach', 'Physiotherapist']), async (_req, res) => {
    const latestByAthlete = await riskScore_model_1.RiskScore.aggregate([
        { $sort: { date: -1 } },
        { $group: { _id: '$athleteId', latest: { $first: '$$ROOT' } } },
    ]);
    return res.json({ athletes: latestByAthlete.map((a) => ({ athleteId: a._id, level: a.latest.level, score: a.latest.score })) });
});
exports.default = router;
//# sourceMappingURL=coach.js.map