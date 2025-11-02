import { Schema, model } from 'mongoose';

const AttachmentSchema = new Schema({
  url: { type: String, required: true },
  filename: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
}, { _id: false });

const MessageSchema = new Schema({
  senderUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recipientUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, default: '' },
  attachments: { type: [AttachmentSchema], default: [] },
}, { timestamps: true });

export const Message = model('Message', MessageSchema);
