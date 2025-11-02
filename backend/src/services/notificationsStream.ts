import type { Response } from 'express';

// Store active SSE connections
const sseConnections = new Map<string, Response>();

export function registerConnection(userId: string, res: Response) {
  sseConnections.set(userId, res);
}

export function removeConnection(userId: string) {
  sseConnections.delete(userId);
}

export function broadcastToUser(userId: string, notification: any) {
  const connection = sseConnections.get(userId);
  if (connection) {
    try {
      connection.write(`data: ${JSON.stringify({ type: 'notification', data: notification })}\n\n`);
    } catch (error) {
      console.error('Error broadcasting to user:', error);
      sseConnections.delete(userId);
    }
  }
}

