import { useMemo } from "react"
import { useUserStore } from "@/store/userStore"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { acceptNotification, declineNotification, getNotificationsForUser, type Notification } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle, XCircle } from "lucide-react"

export function Notifications() {
  const { user } = useUserStore()
  const queryClient = useQueryClient()

  const userId = user?.id || ""

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notifications", userId],
    queryFn: async () => {
      if (!userId) return { notifications: [] as Notification[] }
      return getNotificationsForUser(userId)
    },
    enabled: !!userId,
    refetchInterval: 10000, // 10 seconds
  })

  const notifications = data?.notifications || []

  const acceptMut = useMutation({
    mutationFn: (id: string) => acceptNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] })
    },
  })

  const declineMut = useMutation({
    mutationFn: (id: string) => declineNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] })
    },
  })

  const pendingCount = useMemo(() => notifications.filter(n => n.status === 'pending').length, [notifications])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="h-6 w-6" />
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-muted-foreground text-sm">Alerts and invites for your account</p>
          </div>
        </div>
        <Badge variant={pendingCount > 0 ? "destructive" : "secondary"}>
          {pendingCount > 0 ? `${pendingCount} pending` : "All caught up"}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>Accept or decline coach invitations</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="text-sm text-muted-foreground">Loading notifications...</div>
          )}
          {isError && (
            <div className="text-sm text-destructive">{(error as Error)?.message || 'Failed to load notifications'}</div>
          )}
          {!isLoading && notifications.length === 0 && (
            <div className="text-sm text-muted-foreground">No notifications</div>
          )}

          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n._id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-start gap-3">
                  {n.status === 'accepted' ? (
                    <CheckCircle className="h-5 w-5 text-safe mt-0.5" />
                  ) : n.status === 'declined' ? (
                    <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                  ) : (
                    <Bell className="h-5 w-5 text-primary mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{n.type === 'CoachInvite' ? 'Coach Invitation' : n.type}</p>
                    {n.message && (
                      <p className="text-xs text-muted-foreground">{n.message}</p>
                    )}
                    <div className="mt-1">
                      <Badge variant={
                        n.status === 'pending' ? 'secondary' : n.status === 'accepted' ? 'safe' : 'destructive'
                      } className="text-xs">
                        {n.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Actions for pending coach invites */}
                {n.type === 'CoachInvite' && n.status === 'pending' && (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => acceptMut.mutate(n._id)}
                      disabled={acceptMut.isPending}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => declineMut.mutate(n._id)}
                      disabled={declineMut.isPending}
                    >
                      Decline
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Notifications
