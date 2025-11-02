"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const user_model_1 = require("../models/user.model");
const router = (0, express_1.Router)();
// Get current authenticated user's full profile
router.get('/me', auth_1.requireAuth, async (req, res) => {
    try {
        const requester = req.user;
        const user = await user_model_1.User.findById(requester.id).select('-passwordHash');
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        return res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                teamId: user.teamId,
                gender: user.gender,
                age: user.age,
                heightCm: user.heightCm,
                weightKg: user.weightKg,
                bmi: user.bmi,
                aclRisk: user.aclRisk ?? null
            }
        });
    }
    catch (error) {
        console.error('Error fetching current user:', error);
        return res.status(500).json({ error: 'Failed to fetch current user' });
    }
});
// Delete current authenticated user's account (Admins cannot self-delete here)
router.delete('/me', auth_1.requireAuth, async (req, res) => {
    try {
        const requester = req.user;
        if (requester.role === 'Admin') {
            return res.status(400).json({ error: 'Admins cannot delete their own account' });
        }
        const user = await user_model_1.User.findByIdAndDelete(requester.id);
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        return res.json({ message: 'Account deleted' });
    }
    catch (error) {
        console.error('Error deleting current user:', error);
        return res.status(500).json({ error: 'Failed to delete account' });
    }
});
exports.default = router;
//# sourceMappingURL=users.js.map