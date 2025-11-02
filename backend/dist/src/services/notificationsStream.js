"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerConnection = registerConnection;
exports.removeConnection = removeConnection;
exports.broadcastToUser = broadcastToUser;
// Store active SSE connections
const sseConnections = new Map();
function registerConnection(userId, res) {
    sseConnections.set(userId, res);
}
function removeConnection(userId) {
    sseConnections.delete(userId);
}
function broadcastToUser(userId, notification) {
    const connection = sseConnections.get(userId);
    if (connection) {
        try {
            connection.write(`data: ${JSON.stringify({ type: 'notification', data: notification })}\n\n`);
        }
        catch (error) {
            console.error('Error broadcasting to user:', error);
            sseConnections.delete(userId);
        }
    }
}
//# sourceMappingURL=notificationsStream.js.map