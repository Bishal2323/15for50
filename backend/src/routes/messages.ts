import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { requireAuth } from '../middleware/auth';
import { User } from '../models/user.model';
import { Message } from '../models/message.model';
import { Notification } from '../models/notification.model';
import { broadcastToUser } from '../services/notificationsStream';

const router = Router();

// Ensure uploads directory exists
const uploadRoot = path.resolve(process.cwd(), 'uploads', 'messages');
fs.mkdirSync(uploadRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, uploadRoot);
  },
  filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const clean = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${unique}-${clean}`);
  },
});

const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } }); // up to 50MB per file

// Send a message to coach or physiotherapist with optional attachments
router.post('/', requireAuth, upload.array('attachments'), async (req: Request, res: Response) => {
  try {
    const requester = (req as any).user;
    if (!requester) return res.status(401).json({ error: 'Unauthorized' });

    const { recipient, message, recipientUserId: recipientUserIdBody } = req.body as { recipient?: 'coach' | 'physio'; message?: string; recipientUserId?: string };

    // Determine recipient userId
    let recipientUserId: string | null = null;
    const sender = await User.findById(requester.id);
    if (!sender) return res.status(404).json({ error: 'Sender not found' });

    // If a specific recipientUserId is provided, use it (for direct replies)
    if (recipientUserIdBody) {
      const user = await User.findById(recipientUserIdBody);
      if (!user) {
        return res.status(404).json({ error: 'Recipient user not found' });
      }
      recipientUserId = String(user._id);
    } else {
      // Fallback to role-based recipient resolution
      if (!recipient) return res.status(400).json({ error: 'recipient is required (coach|physio) when recipientUserId is not provided' });

      if (recipient === 'coach') {
        if (!sender.coachId) {
          return res.status(400).json({ error: 'No coach assigned to your account' });
        }
        recipientUserId = String(sender.coachId);
      } else if (recipient === 'physio') {
        if (!sender.teamId) {
          return res.status(400).json({ error: 'No team assigned to locate physiotherapist' });
        }
        const physio = await User.findOne({ role: 'Physiotherapist', teamId: sender.teamId });
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
    const files = (req.files as Express.Multer.File[]) || [];
    const attachments = files.map((f) => ({
      url: `/uploads/messages/${f.filename}`,
      filename: f.originalname,
      mimeType: f.mimetype,
      size: f.size,
    }));

    // Create message
    const msg = await Message.create({
      senderUserId: requester.id,
      recipientUserId,
      text: message || '',
      attachments,
    });

    // Create a DirectMessage notification for the recipient
    const note = await Notification.create({
      recipientUserId,
      senderUserId: requester.id,
      type: 'DirectMessage',
      status: 'pending',
      message: (message && message.length > 0) ? message.slice(0, 200) : 'New message received',
      metadata: { messageId: msg._id },
    });

    // Broadcast via SSE if connected
    broadcastToUser(String(recipientUserId), note);

    return res.status(201).json({ message: msg, notification: note });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
