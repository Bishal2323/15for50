import { Bell, CheckCircle, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRealTimeNotifications } from "@/hooks/useRealTimeNotifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptNotification, declineNotification } from "@/lib/api";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { NotificationPopup } from "./NotificationPopup";

export function RealTimeNotifications() {
  const { notifications, isConnected, totalCount, newNotification, clearNewNotification } = useRealTimeNotifications();
  const queryClient = useQueryClient();

  const acceptMut = useMutation({
    mutationFn: (id: string) => acceptNotification(id),
    onSuccess: () => {
      toast.success("Invitation accepted");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to accept invitation");
    }
  });

  const declineMut = useMutation({
    mutationFn: (id: string) => declineNotification(id),
    onSuccess: () => {
      toast.success("Invitation declined");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to decline invitation");
    }
  });

  if (totalCount === 0) {
    return null; // Don't show component if no notifications
  }

  return (
    <>
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Live Notifications</CardTitle>
            <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{totalCount} pending</Badge>
            <Button variant="outline" size="sm" asChild>
              <Link to="/notifications">View All</Link>
            </Button>
          </div>
        </div>
        <CardDescription>
          Real-time notifications and invitations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notifications.slice(0, 3).map((notification) => (
            <div
              key={notification._id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card/50"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {notification.status === 'accepted' ? (
                    <CheckCircle className="h-4 w-4 text-safe" />
                  ) : notification.status === 'declined' ? (
                    <XCircle className="h-4 w-4 text-destructive" />
                  ) : (
                    <Clock className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">
                    {notification.type === 'CoachInvite' ? 'Coach Invitation' : notification.type}
                  </p>
                  {notification.message && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {notification.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick actions for pending notifications */}
              {notification.type === 'CoachInvite' && notification.status === 'pending' && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    onClick={() => acceptMut.mutate(notification._id)}
                    disabled={acceptMut.isPending}
                    className="h-8 px-3"
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => declineMut.mutate(notification._id)}
                    disabled={declineMut.isPending}
                    className="h-8 px-3"
                  >
                    Decline
                  </Button>
                </div>
              )}
            </div>
          ))}
          
          {totalCount > 3 && (
            <div className="text-center pt-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/notifications">
                  View {totalCount - 3} more notifications
                </Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
    
    {/* Popup for new notifications */}
    {newNotification && (
      <NotificationPopup
        notification={newNotification}
        onClose={clearNewNotification}
      />
    )}
  </>
  );
}
