import { useEffect, useState, useRef } from 'react';
import { useUserStore } from '@/store/userStore';
import { type Notification, API_BASE } from '@/lib/api';

interface NotificationEvent {
  type: 'connected' | 'notification' | 'initial';
  data?: Notification | Notification[];
  message?: string;
}

export function useRealTimeNotifications() {
  const { user } = useUserStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [newNotification, setNewNotification] = useState<Notification | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const connectToStream = () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const eventSource = new EventSource(
        `${API_BASE}/notifications/stream/${user.id}?token=${encodeURIComponent(token)}`
      );

      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log('Connected to notification stream');
        setIsConnected(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const data: NotificationEvent = JSON.parse(event.data);
          
          switch (data.type) {
            case 'connected':
              console.log('SSE connection established:', data.message);
              break;
              
            case 'initial':
              if (Array.isArray(data.data)) {
                setNotifications(data.data);
              }
              break;
              
            case 'notification':
              if (data.data && !Array.isArray(data.data)) {
                setNotifications(prev => {
                  // Check if notification already exists to avoid duplicates
                  const exists = prev.some(n => n._id === data.data!._id);
                  if (!exists) {
                    // Set as new notification for popup display
                    setNewNotification(data.data!);
                    return [data.data!, ...prev];
                  }
                  return prev;
                });
              } else if (data.data && Array.isArray(data.data)) {
                // Handle updated notification (e.g., status change)
                setNotifications(prev => {
                  return prev.map(n => {
                    const updated = (data.data as Notification[]).find(u => u._id === n._id);
                    return updated || n;
                  });
                });
              }
              break;
          }
        } catch (error) {
          console.error('Error parsing SSE message:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        setIsConnected(false);
        
        // Attempt to reconnect after a delay
        setTimeout(() => {
          if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
            connectToStream();
          }
        }, 5000);
      };
    };

    connectToStream();

    // Cleanup on unmount or user change
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      setIsConnected(false);
      setNotifications([]);
    };
  }, [user?.id]);

  // Filter only pending notifications for real-time display
  const pendingNotifications = notifications.filter(n => n.status === 'pending');

  const clearNewNotification = () => {
    setNewNotification(null);
  };

  return {
    notifications: pendingNotifications,
    isConnected,
    totalCount: pendingNotifications.length,
    newNotification,
    clearNewNotification
  };
}
