"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const riskScore_model_1 = require("../models/riskScore.model");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/history', auth_1.requireAuth, async (req, res) => {
    const user = req.user;
    const scores = await riskScore_model_1.RiskScore.find({ athleteId: user.id }).sort({ date: 1 });
    return res.json({ scores });
});
exports.default = router;
//# sourceMappingURL=risk.js.map