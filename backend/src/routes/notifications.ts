import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';
import { Notification } from '../models/notification.model';
import { User } from '../models/user.model';
import { registerConnection, removeConnection, broadcastToUser } from '../services/notificationsStream';

const router = Router();

// SSE connection management moved to service

// Server-Sent Events endpoint for real-time notifications
router.get('/stream/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { token } = req.query;
    
    // Manual token verification for SSE since EventSource doesn't support headers
    if (!token) {
      return res.status(401).json({ error: 'Token required' });
    }
    
    // Import jwt here to avoid circular dependencies
    const jwt = require('jsonwebtoken');
    const { JWT_SECRET } = require('../setup/env').loadEnv();
    
    let requester;
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      requester = decoded;
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    // Only the user themselves can stream their notifications
    if (requester.id !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Set SSE headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    });

    // Store connection
    registerConnection(userId, res);

    // Send initial connection message
    res.write(`data: ${JSON.stringify({ type: 'connected', message: 'Connected to notification stream' })}\n\n`);

    // Send current pending notifications
    const notifications = await Notification.find({ 
      recipientUserId: userId, 
      status: 'pending' 
    }).sort({ createdAt: -1 });
    
    if (notifications.length > 0) {
      res.write(`data: ${JSON.stringify({ type: 'initial', data: notifications })}\n\n`);
    }

    // Handle client disconnect
    req.on('close', () => {
      removeConnection(userId);
    });

  } catch (error) {
    console.error('Error setting up SSE stream:', error);
    res.status(500).json({ error: 'Failed to setup notification stream' });
  }
});

// Get notifications for a single userId (recipient)
router.get('/:userId', requireAuth, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const requester = (req as any).user;
    if (!requester) return res.status(401).json({ error: 'Unauthorized' });
    // Only the user themselves or an Admin can view notifications for userId
    if (requester.id !== userId && requester.role !== 'Admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const notifications = await Notification.find({ recipientUserId: userId })
      .sort({ createdAt: -1 });
    res.json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Create a notification (e.g., coach invite)
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const senderId = (req as any).user?.id;
    const { recipientUserId, type, message } = req.body as { recipientUserId: string; type: 'CoachInvite' | 'DirectMessage'; message?: string };
    if (!recipientUserId || !type) {
      return res.status(400).json({ error: 'recipientUserId and type are required' });
    }

    // For coach invite, validate roles
    if (type === 'CoachInvite') {
      const recipient = await User.findById(recipientUserId);
      const sender = await User.findById(senderId);
      if (!recipient || recipient.role !== 'Athlete') {
        return res.status(400).json({ error: 'Recipient must be an Athlete' });
      }
      if (!sender || sender.role !== 'Coach') {
        return res.status(403).json({ error: 'Only Coaches can send invites' });
      }
    }

    // DirectMessage does not require accept/decline and can be sent by any authenticated user

    // Prevent duplicate pending invites for same sender/recipient/type
    // Prevent duplicate pending invites for same sender/recipient/type (only for CoachInvite)
    if (type === 'CoachInvite') {
      const existingPending = await Notification.findOne({
        recipientUserId,
        senderUserId: senderId,
        type,
        status: 'pending',
      });
      if (existingPending) {
        return res.status(200).json({ notification: existingPending, message: 'Existing pending notification found' });
      }
    }

    const notification = await Notification.create({
      recipientUserId,
      senderUserId: senderId,
      type,
      status: 'pending',
      message,
      metadata: { coachId: senderId, athleteId: recipientUserId },
    });

    // Broadcast new notification to recipient via SSE
    broadcastToUser(recipientUserId, notification);

    res.status(201).json({ notification, message: 'Notification created' });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

export default router;
// Accept a pending notification (e.g., athlete accepts coach invite)
router.post('/:notificationId/accept', requireAuth, async (req: Request, res: Response) => {
  try {
    const requester = (req as any).user;
    if (!requester) return res.status(401).json({ error: 'Unauthorized' });
    const { notificationId } = req.params;
    const notification = await Notification.findById(notificationId);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    if (String(notification.recipientUserId) !== String(requester.id)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    if (notification.type !== 'CoachInvite' || notification.status !== 'pending') {
      return res.status(400).json({ error: 'Notification is not a pending invite' });
    }

    // Set athlete's coachId to sender
    const athlete = await User.findById(notification.recipientUserId);
    const coach = await User.findById(notification.senderUserId);
    if (!athlete || athlete.role !== 'Athlete') {
      return res.status(400).json({ error: 'Recipient is not an Athlete' });
    }
    if (!coach || coach.role !== 'Coach') {
      return res.status(400).json({ error: 'Sender is not a Coach' });
    }

    athlete.coachId = coach._id as any;
    await athlete.save();
    notification.status = 'accepted';
    await notification.save();
    
    // Broadcast status update to recipient
    broadcastToUser(String(notification.recipientUserId), notification);
    
    res.json({ notification, athlete, message: 'Invite accepted; coach assigned' });
  } catch (error) {
    console.error('Error accepting notification:', error);
    res.status(500).json({ error: 'Failed to accept notification' });
  }
});

// Decline a pending notification (e.g., athlete declines coach invite)
router.post('/:notificationId/decline', requireAuth, async (req: Request, res: Response) => {
  try {
    const requester = (req as any).user;
    if (!requester) return res.status(401).json({ error: 'Unauthorized' });
    const { notificationId } = req.params;
    const notification = await Notification.findById(notificationId);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    if (String(notification.recipientUserId) !== String(requester.id)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    if (notification.type !== 'CoachInvite' || notification.status !== 'pending') {
      return res.status(400).json({ error: 'Notification is not a pending invite' });
    }

    notification.status = 'declined';
    await notification.save();
    
    // Broadcast status update to recipient
    broadcastToUser(String(notification.recipientUserId), notification);
    
    res.json({ notification, message: 'Invite declined' });
  } catch (error) {
    console.error('Error declining notification:', error);
    res.status(500).json({ error: 'Failed to decline notification' });
  }
});
