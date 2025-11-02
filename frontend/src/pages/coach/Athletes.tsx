import { Search, Filter, Plus, MoreHorizontal, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RiskIndicator } from "@/components/custom/RiskIndicator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Modal } from "@/components/ui/modal"
import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createAthleteAsCoach, getCoachAthletes } from "@/lib/api"

// Mock data
const athletes = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/avatars/sarah.jpg",
    position: "Forward",
    team: "Varsity",
    currentRisk: 75,
    trend: "up",
    lastReport: "2 hours ago",
    status: "active",
    alerts: 2
  },
  {
    id: 2,
    name: "Mike Chen",
    avatar: "/avatars/mike.jpg", 
    position: "Midfielder",
    team: "Varsity",
    currentRisk: 25,
    trend: "down",
    lastReport: "1 day ago",
    status: "active",
    alerts: 0
  },
  {
    id: 3,
    name: "Emma Davis",
    avatar: "/avatars/emma.jpg",
    position: "Defender",
    team: "JV",
    currentRisk: 45,
    trend: "up",
    lastReport: "3 hours ago",
    status: "active",
    alerts: 1
  },
  {
    id: 4,
    name: "Alex Rodriguez",
    avatar: "/avatars/alex.jpg",
    position: "Goalkeeper",
    team: "Varsity",
    currentRisk: 30,
    trend: "down",
    lastReport: "5 hours ago",
    status: "injured",
    alerts: 0
  },
  {
    id: 5,
    name: "Jordan Smith",
    avatar: "/avatars/jordan.jpg",
    position: "Forward",
    team: "JV",
    currentRisk: 60,
    trend: "up",
    lastReport: "1 hour ago",
    status: "active",
    alerts: 3
  }
]

export function CoachAthletes() {
  const [addOpen, setAddOpen] = useState(false)
  const [newEmail, setNewEmail] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const qc = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ["coach","athletes"],
    queryFn: async () => {
      const res = await getCoachAthletes()
      return res.athletes
    },
    refetchOnWindowFocus: true,
    refetchInterval: 15000,
  })

  const addMutation = useMutation({
    mutationFn: async () => {
      return createAthleteAsCoach({ email: newEmail.trim() })
    },
    onSuccess: async () => {
      setAddOpen(false)
      setNewEmail("")
      setErrorMsg("")
      toast.success("Invitation sent")
      await qc.invalidateQueries({ queryKey: ["coach","athletes"] })
    },
    onError: (err: any) => {
      const msg = err?.message || 'Failed to send invite'
      setErrorMsg(msg)
      toast.error(msg)
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Athletes</h1>
          <p className="text-muted-foreground">Monitor and manage your team's ACL injury risk</p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Athlete
        </Button>
      </div>

      {/* Invite Athlete Modal */}
      <Modal open={addOpen} onClose={() => { setAddOpen(false); setErrorMsg("") }} title="Invite Athlete">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Email</label>
            <Input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="athlete@example.com" />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAddOpen(false)} disabled={addMutation.isLoading}>Cancel</Button>
            <Button
              onClick={() => addMutation.mutate()}
              disabled={addMutation.isLoading || !newEmail}
            >
              {addMutation.isLoading ? 'Sending...' : 'Send Invite'}
            </Button>
          </div>
          {addMutation.isError && (
            <p className="text-sm text-destructive">{errorMsg || 'Failed to send invite'}</p>
          )}
        </div>
      </Modal>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search athletes..." className="pl-10" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Teams</SelectItem>
            <SelectItem value="varsity">Varsity</SelectItem>
            <SelectItem value="jv">JV</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="injured">Injured</SelectItem>
            <SelectItem value="recovering">Recovering</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Athletes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Team Roster</CardTitle>
          <CardDescription>Overview of all athletes and their current risk status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Athlete</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Current Risk</TableHead>
                <TableHead>Trend</TableHead>
                <TableHead>Last Report</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Alerts</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(isLoading || isError) && athletes.map((athlete) => (
                <TableRow key={athlete.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={athlete.avatar} />
                        <AvatarFallback>{athlete.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{athlete.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{athlete.position}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{athlete.team}</Badge>
                  </TableCell>
                  <TableCell>
                    <RiskIndicator score={athlete.currentRisk} size="sm" />
                  </TableCell>
                  <TableCell>
                    {athlete.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-high" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-safe" />
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{athlete.lastReport}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={athlete.status === 'active' ? 'safe' : athlete.status === 'injured' ? 'high' : 'monitor'}
                    >
                      {athlete.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {athlete.alerts > 0 && (
                      <Badge variant="high" className="text-xs">
                        {athlete.alerts}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && !isError && data && data.map((athlete: any) => (
                <TableRow key={athlete._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${athlete.email}`} />
                        <AvatarFallback>{String(athlete.email || '').slice(0,2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{athlete.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    <Badge variant="outline">{athlete.teamId ? String(athlete.teamId) : '—'}</Badge>
                  </TableCell>
                  <TableCell>
                    <RiskIndicator score={50} size="sm" />
                  </TableCell>
                  <TableCell>
                    <TrendingDown className="h-4 w-4 text-safe" />
                  </TableCell>
                  <TableCell className="text-muted-foreground">—</TableCell>
                  <TableCell>
                    <Badge variant="monitor">active</Badge>
                  </TableCell>
                  <TableCell>
                    {/* alerts placeholder */}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">High Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-high">2</div>
            <p className="text-xs text-muted-foreground">Athletes need attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-monitor">6</div>
            <p className="text-xs text-muted-foreground">Unresolved alerts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reports Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-safe">4</div>
            <p className="text-xs text-muted-foreground">Out of 5 athletes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Team Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-monitor">47</div>
            <p className="text-xs text-muted-foreground">Risk score</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
