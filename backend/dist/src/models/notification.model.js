"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = require("mongoose");
const NotificationSchema = new mongoose_1.Schema({
    recipientUserId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    senderUserId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['CoachInvite', 'DirectMessage'], required: true },
    status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
    message: { type: String },
    // Optional metadata to store related entities
    metadata: {
        coachId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
        athleteId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
        messageId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Message' },
    },
}, { timestamps: true });
exports.Notification = (0, mongoose_1.model)('Notification', NotificationSchema);
//# sourceMappingURL=notification.model.js.map