"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = require("mongoose");
const AttachmentSchema = new mongoose_1.Schema({
    url: { type: String, required: true },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
}, { _id: false });
const MessageSchema = new mongoose_1.Schema({
    senderUserId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    recipientUserId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, default: '' },
    attachments: { type: [AttachmentSchema], default: [] },
}, { timestamps: true });
exports.Message = (0, mongoose_1.model)('Message', MessageSchema);
//# sourceMappingURL=message.model.js.map