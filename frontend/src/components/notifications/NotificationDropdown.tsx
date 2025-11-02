import { Bell, CheckCircle, XCircle, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRealTimeNotifications } from "@/hooks/useRealTimeNotifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptNotification, declineNotification } from "@/lib/api";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onReply?: (userId: string) => void;
}

export function NotificationDropdown({ isOpen, onClose, onReply }: NotificationDropdownProps) {
  const { notifications, isConnected, totalCount } = useRealTimeNotifications();
  const queryClient = useQueryClient();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const acceptMut = useMutation({
    mutationFn: (id: string) => acceptNotification(id),
    onSuccess: () => {
      toast.success("Invitation accepted");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to accept invitation");
    },
  });

  const declineMut = useMutation({
    mutationFn: (id: string) => declineNotification(id),
    onSuccess: () => {
      toast.success("Invitation declined");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to decline invitation");
    },
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const pendingNotifications = notifications.filter(n => n.status === 'pending');

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 top-12 w-96 max-h-96 overflow-y-auto bg-background border rounded-lg shadow-lg z-50"
    >
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Notifications</h3>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-xs text-muted-foreground">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        {totalCount > 0 && (
          <p className="text-sm text-muted-foreground mt-1">
            {totalCount} pending notification{totalCount !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto">
        {pendingNotifications.length === 0 ? (
          <div className="p-6 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No new notifications</p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {pendingNotifications.map((notification) => (
              <Card key={notification._id} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-sm">
                        {notification.type === 'CoachInvite' ? 'Coach Invitation' : 
                         notification.type === 'DirectMessage' ? 'New Message' : 
                         notification.type}
                      </CardTitle>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm mb-3">
                    {notification.message || 
                     (notification.type === 'CoachInvite' ? "You have received a coach invitation" : 
                      notification.type === 'DirectMessage' ? "You have a new message" : 
                      "You have a new notification")}
                  </CardDescription>
                  
                  {notification.type === 'CoachInvite' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => acceptMut.mutate(notification._id)}
                        disabled={acceptMut.isPending || declineMut.isPending}
                        className="flex-1"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => declineMut.mutate(notification._id)}
                        disabled={acceptMut.isPending || declineMut.isPending}
                        className="flex-1"
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Decline
                      </Button>
                    </div>
                  )}

                  {notification.type === 'DirectMessage' && onReply && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => onReply?.(notification.senderUserId)}
                      >
                        Reply
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 border-t bg-muted/50">
        <Link to="/notifications" onClick={onClose}>
          <Button variant="ghost" size="sm" className="w-full">
            View All Notifications
          </Button>
        </Link>
      </div>
    </div>
  );
}
