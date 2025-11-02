import { Schema, model } from 'mongoose';

export type NotificationType = 'CoachInvite' | 'DirectMessage';
export type NotificationStatus = 'pending' | 'accepted' | 'declined';

const NotificationSchema = new Schema({
  recipientUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  senderUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['CoachInvite', 'DirectMessage'], required: true },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  message: { type: String },
  // Optional metadata to store related entities
  metadata: {
    coachId: { type: Schema.Types.ObjectId, ref: 'User' },
    athleteId: { type: Schema.Types.ObjectId, ref: 'User' },
    messageId: { type: Schema.Types.ObjectId, ref: 'Message' },
  },
}, { timestamps: true });

export const Notification = model('Notification', NotificationSchema);
