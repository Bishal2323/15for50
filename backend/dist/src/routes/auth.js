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
const auth_1 = require("../middleware/auth");
const env = (0, env_1.loadEnv)();
const router = (0, express_1.Router)();
router.post('/signup', async (req, res) => {
    const { email, password, role } = req.body || {};
    if (!email || !password)
        return res.status(400).json({ error: 'Missing email or password' });
    if (role && !['Athlete', 'Coach', 'Physiotherapist', 'Admin'].includes(role))
        return res.status(400).json({ error: 'Invalid role' });
    const existing = await user_model_1.User.findOne({ email });
    if (existing)
        return res.status(409).json({ error: 'Email already registered' });
    const user = await user_model_1.User.create({
        email,
        role: role,
        teamId: undefined,
        passwordHash: await bcryptjs_1.default.hash(password, 10),
    });
    const payload = { id: user.id, email: user.email, role: user.role };
    const secret = env.JWT_SECRET;
    const options = { expiresIn: env.JWT_EXPIRES_IN };
    const token = jsonwebtoken_1.default.sign(payload, secret, options);
    return res.status(201).json({ access_token: token, user: { id: user.id, email: user.email, role: user.role, aclRisk: user.aclRisk ?? null } });
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
    return res.json({ access_token: token, user: { id: user.id, name: user.name, email: user.email, role: user.role, gender: user.gender, aclRisk: user.aclRisk ?? null } });
});
// Athlete onboarding: optionally capture height/weight/name/gender and compute BMI
router.post('/onboarding', auth_1.requireAuth, async (req, res) => {
    try {
        const requester = req.user;
        if (!requester)
            return res.status(401).json({ error: 'Unauthorized' });
        if (requester.role !== 'Athlete')
            return res.status(403).json({ error: 'Forbidden: only athletes can onboard' });
        const { heightCm, weightKg, heightInches, weightPounds, name, gender, age } = req.body || {};
        const updates = {};
        if (typeof name === 'string')
            updates.name = name;
        if (gender && ['male', 'female'].includes(String(gender)))
            updates.gender = gender;
        const ageNum = Number(age);
        if (!Number.isNaN(ageNum) && ageNum > 0)
            updates.age = ageNum;
        // Accept either metric or imperial values; convert imperial to metric
        let h = Number(heightCm);
        let w = Number(weightKg);
        const hin = Number(heightInches);
        const wp = Number(weightPounds);
        if (!Number.isNaN(hin) && hin > 0 && (Number.isNaN(h) || h <= 0)) {
            // 1 inch = 2.54 cm
            h = hin * 2.54;
        }
        if (!Number.isNaN(wp) && wp > 0 && (Number.isNaN(w) || w <= 0)) {
            // 1 lb = 0.453592 kg
            w = wp * 0.453592;
        }
        if (!Number.isNaN(h) && h > 0)
            updates.heightCm = h;
        if (!Number.isNaN(w) && w > 0)
            updates.weightKg = w;
        if (updates.heightCm && updates.weightKg) {
            const heightM = updates.heightCm / 100;
            const bmi = updates.weightKg / (heightM * heightM);
            updates.bmi = Math.round(bmi * 10) / 10;
        }
        const user = await user_model_1.User.findByIdAndUpdate(requester.id, { $set: updates }, { new: true }).select('-passwordHash');
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        return res.json({ message: 'Onboarding completed', user });
    }
    catch (error) {
        console.error('Error during onboarding:', error);
        return res.status(500).json({ error: 'Failed to complete onboarding' });
    }
});
// Update profile: allow editing core fields and recompute BMI
router.post('/update-profile', auth_1.requireAuth, async (req, res) => {
    try {
        const requester = req.user;
        if (!requester)
            return res.status(401).json({ error: 'Unauthorized' });
        const { name, gender, age, heightCm, weightKg } = req.body || {};
        const updates = {};
        if (typeof name === 'string')
            updates.name = name;
        if (gender && ['male', 'female'].includes(String(gender)))
            updates.gender = gender;
        const ageNum = Number(age);
        if (!Number.isNaN(ageNum) && ageNum > 0)
            updates.age = ageNum;
        const h = Number(heightCm);
        const w = Number(weightKg);
        if (!Number.isNaN(h) && h > 0)
            updates.heightCm = h;
        if (!Number.isNaN(w) && w > 0)
            updates.weightKg = w;
        if (updates.heightCm && updates.weightKg) {
            const heightM = updates.heightCm / 100;
            const bmi = updates.weightKg / (heightM * heightM);
            updates.bmi = Math.round(bmi * 10) / 10;
        }
        const user = await user_model_1.User.findByIdAndUpdate(requester.id, { $set: updates }, { new: true }).select('-passwordHash');
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        return res.json({ message: 'Profile updated', user });
    }
    catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ error: 'Failed to update profile' });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map