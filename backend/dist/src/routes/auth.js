"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const env_1 = require("../setup/env");
const env = (0, env_1.loadEnv)();
const router = (0, express_1.Router)();
router.post('/signup', async (req, res) => {
    const { email, password, role } = req.body || {};
    if (!email || !password)
        return res.status(400).json({ error: 'Missing email or password' });
    if (role && !['Athlete', 'Coach', 'Physiotherapist'].includes(role))
        return res.status(400).json({ error: 'Invalid role' });
    const existing = await user_model_1.User.findOne({ email });
    if (existing)
        return res.status(409).json({ error: 'Email already registered' });
    const user = await user_model_1.User.create({
        email,
        role: role || 'Athlete',
        teamId: undefined,
        passwordHash: await bcryptjs_1.default.hash(password, 10),
    });
    const payload = { id: user.id, email: user.email, role: user.role };
    const secret = env.JWT_SECRET;
    const options = { expiresIn: env.JWT_EXPIRES_IN };
    const token = jsonwebtoken_1.default.sign(payload, secret, options);
    return res.status(201).json({ access_token: token, user: { id: user.id, email: user.email, role: user.role } });
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password)
        return res.status(400).json({ error: 'Missing email or password' });
    const user = await user_model_1.User.findOne({ email });
    if (!user)
        return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!ok)
        return res.status(401).json({ error: 'Invalid credentials' });
    const payload = { id: user.id, email: user.email, role: user.role };
    const secret = env.JWT_SECRET;
    const expiresInVal = /^\d+(?:\.\d+)?$/.test(env.JWT_EXPIRES_IN)
        ? Number(env.JWT_EXPIRES_IN)
        : env.JWT_EXPIRES_IN;
    const options = { expiresIn: expiresInVal };
    const token = jsonwebtoken_1.default.sign(payload, secret, options);
    return res.json({ access_token: token, user: { id: user.id, email: user.email, role: user.role } });
});
exports.default = router;
//# sourceMappingURL=auth.js.map