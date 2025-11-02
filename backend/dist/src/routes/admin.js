"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const router = (0, express_1.Router)();
// Admin middleware - require admin role for all routes
router.use(auth_1.requireAuth);
router.use((0, auth_1.requireRole)('Admin'));
// Get all users with pagination and filtering
router.get('/users', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const role = req.query.role;
        const search = req.query.search;
        const skip = (page - 1) * limit;
        // Build filter query
        const filter = {};
        // Always exclude Admins from results
        filter.role = { $ne: 'Admin' };
        if (search) {
            filter.email = { $regex: search, $options: 'i' };
        }
        const users = await user_model_1.User.find(filter)
            .select('-passwordHash')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        console.log(users, 'USERS');
        const total = await user_model_1.User.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);
        res.json({
            users,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});
// Get user statistics
router.get('/stats', async (req, res) => {
    try {
        // Exclude Admins from stats
        const nonAdminMatch = { role: { $ne: 'Admin' } };
        const totalUsers = await user_model_1.User.countDocuments(nonAdminMatch);
        const usersByRole = await user_model_1.User.aggregate([
            { $match: nonAdminMatch },
            { $group: { _id: '$role', count: { $sum: 1 } } }
        ]);
        const recentUsers = await user_model_1.User.find(nonAdminMatch)
            .select('-passwordHash')
            .sort({ createdAt: -1 })
            .limit(5);
        const stats = {
            totalUsers,
            usersByRole: usersByRole.reduce((acc, item) => {
                acc[item._id] = item.count;
                return acc;
            }, {}),
            recentUsers
        };
        res.json(stats);
    }
    catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});
// Get single user by ID
router.get('/users/:id', async (req, res) => {
    try {
        const user = await user_model_1.User.findById(req.params.id).select('-passwordHash');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Exclude Admin details from being returned
        if (user.role === 'Admin') {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ user });
    }
    catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});
// Update user
router.put('/users/:id', async (req, res) => {
    try {
        const { email, role, teamId } = req.body;
        const updateData = {};
        if (email)
            updateData.email = email;
        if (role)
            updateData.role = role;
        if (teamId !== undefined)
            updateData.teamId = teamId || null;
        const user = await user_model_1.User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true }).select('-passwordHash');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ user, message: 'User updated successfully' });
    }
    catch (error) {
        console.error('Error updating user:', error);
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Failed to update user' });
    }
});
// Reset user password
router.put('/users/:id/reset-password', async (req, res) => {
    try {
        const { newPassword } = req.body;
        if (!newPassword || newPassword.length < 4) {
            return res.status(400).json({ error: 'Password must be at least 4 characters' });
        }
        const passwordHash = await bcrypt_1.default.hash(newPassword, 10);
        const user = await user_model_1.User.findByIdAndUpdate(req.params.id, { passwordHash }, { new: true }).select('-passwordHash');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'Password reset successfully' });
    }
    catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: 'Failed to reset password' });
    }
});
// Delete user
router.delete('/users/:id', async (req, res) => {
    try {
        const currentUser = req.user;
        // Prevent admin from deleting themselves
        if (req.params.id === currentUser.id) {
            return res.status(400).json({ error: 'Cannot delete your own account' });
        }
        const user = await user_model_1.User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});
// Bulk delete users by role (excluding Admin)
router.delete('/users', async (req, res) => {
    try {
        const { role } = req.query;
        const currentUser = req.user;
        if (!role) {
            return res.status(400).json({ error: 'Query parameter role is required' });
        }
        const allowedRoles = ['Athlete', 'Coach', 'Physiotherapist'];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ error: 'Invalid role. Allowed: Athlete, Coach, Physiotherapist' });
        }
        // Ensure we never delete the current admin and we never touch Admins here
        const result = await user_model_1.User.deleteMany({ role, _id: { $ne: currentUser.id } });
        res.json({ message: `Deleted ${result.deletedCount} users with role ${role}` });
    }
    catch (error) {
        console.error('Error bulk deleting users:', error);
        res.status(500).json({ error: 'Failed to bulk delete users' });
    }
});
// Create new user
router.post('/users', async (req, res) => {
    try {
        const { email, password, role, teamId } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({ error: 'Email, password, and role are required' });
        }
        if (password.length < 4) {
            return res.status(400).json({ error: 'Password must be at least 4 characters' });
        }
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        const user = new user_model_1.User({
            email,
            passwordHash,
            role,
            teamId: teamId || null
        });
        await user.save();
        const userResponse = user.toObject();
        delete userResponse.passwordHash;
        res.status(201).json({ user: userResponse, message: 'User created successfully' });
    }
    catch (error) {
        console.error('Error creating user:', error);
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Failed to create user' });
    }
});
exports.default = router;
//# sourceMappingURL=admin.js.map