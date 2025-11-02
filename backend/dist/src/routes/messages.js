"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const auth_1 = require("../middleware/auth");
const user_model_1 = require("../models/user.model");
const message_model_1 = require("../models/message.model");
const notification_model_1 = require("../models/notification.model");
const notificationsStream_1 = require("../services/notificationsStream");
const router = (0, express_1.Router)();
// Ensure uploads directory exists
const uploadRoot = path_1.default.resolve(process.cwd(), 'uploads', 'messages');
fs_1.default.mkdirSync(uploadRoot, { recursive: true });
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadRoot);
    },
    filename: (_req, file, cb) => {
        const unique = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const clean = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
        cb(null, `${unique}-${clean}`);
    },
});
const upload = (0, multer_1.default)({ storage, limits: { fileSize: 50 * 1024 * 1024 } }); // up to 50MB per file
// Send a message to coach or physiotherapist with optional attachments
router.post('/', auth_1.requireAuth, upload.array('attachments'), async (req, res) => {
    try {
        const requester = req.user;
        if (!requester)
            return res.status(401).json({ error: 'Unauthorized' });
        const { recipient, message, recipientUserId: recipientUserIdBody } = req.body;
        // Determine recipient userId
        let recipientUserId = null;
        const sender = await user_model_1.User.findById(requester.id);
        if (!sender)
            return res.status(404).json({ error: 'Sender not found' });
        // If a specific recipientUserId is provided, use it (for direct replies)
        if (recipientUserIdBody) {
            const user = await user_model_1.User.findById(recipientUserIdBody);
            if (!user) {
                return res.status(404).json({ error: 'Recipient user not found' });
            }
            recipientUserId = String(user._id);
        }
        else {
            // Fallback to role-based recipient resolution
            if (!recipient)
                return res.status(400).json({ error: 'recipient is required (coach|physio) when recipientUserId is not provided' });
            if (recipient === 'coach') {
                if (!sender.coachId) {
                    return res.status(400).json({ error: 'No coach assigned to your account' });
                }
                recipientUserId = String(sender.coachId);
            }
            else if (recipient === 'physio') {
                if (!sender.teamId) {
                    return res.status(400).json({ error: 'No team assigned to locate physiotherapist' });
                }
                const physio = await user_model_1.User.findOne({ role: 'Physiotherapist', teamId: sender.teamId });
                if (!physio) {
                    return res.status(404).json({ error: 'No physiotherapist found for your team' });
                }
                recipientUserId = String(physio._id);
            }
        }
        if (!recipientUserId) {
            return res.status(400).json({ error: 'Unable to determine recipient' });
        }
        // Build attachment metadata
        const files = req.files || [];
        const attachments = files.map((f) => ({
            url: `/uploads/messages/${f.filename}`,
            filename: f.originalname,
            mimeType: f.mimetype,
            size: f.size,
        }));
        // Create message
        const msg = await message_model_1.Message.create({
            senderUserId: requester.id,
            recipientUserId,
            text: message || '',
            attachments,
        });
        // Create a DirectMessage notification for the recipient
        const note = await notification_model_1.Notification.create({
            recipientUserId,
            senderUserId: requester.id,
            type: 'DirectMessage',
            status: 'pending',
            message: (message && message.length > 0) ? message.slice(0, 200) : 'New message received',
            metadata: { messageId: msg._id },
        });
        // Broadcast via SSE if connected
        (0, notificationsStream_1.broadcastToUser)(String(recipientUserId), note);
        return res.status(201).json({ message: msg, notification: note });
    }
    catch (error) {
        console.error('Error sending message:', error);
        return res.status(500).json({ error: 'Failed to send message' });
    }
});
exports.default = router;
//# sourceMappingURL=messages.js.map