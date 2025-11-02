import { useEffect, useState } from "react";
import { Bell, CheckCircle, XCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptNotification, declineNotification, type Notification } from "@/lib/api";
import { toast } from "sonner";

interface NotificationPopupProps {
  notification: Notification | null;
  onClose: () => void;
}

export function NotificationPopup({ notification, onClose }: NotificationPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const queryClient = useQueryClient();

  const acceptMut = useMutation({
    mutationFn: (id: string) => acceptNotification(id),
    onSuccess: () => {
      toast.success("Invitation accepted");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      onClose();
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
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to decline invitation");
    },
  });

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
      // Auto-hide after 10 seconds if no action is taken
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, 10000);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [notification, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  if (!notification) return null;

  return (
    <div className="fixed top-4 right-4 z-[100]">
      <div 
        className={`transform transition-all duration-300 ease-in-out ${
          isVisible 
            ? 'translate-x-0 opacity-100 scale-100' 
            : 'translate-x-full opacity-0 scale-95'
        }`}
      >
        <Card className="w-80 border-l-4 border-l-blue-500 shadow-lg bg-background">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-blue-100 rounded-full">
                  <Bell className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-sm">New Notification</CardTitle>
                  <Badge variant="outline" className="text-xs mt-1">
                    Coach Invitation
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <CardDescription className="text-sm mb-4">
              {notification.message || "You have received a coach invitation"}
            </CardDescription>
            
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}