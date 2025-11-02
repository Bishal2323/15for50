import { AlertTriangle, Clock, CheckCircle, X, Filter, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Mock data
const alerts = [
  {
    id: 1,
    type: "high_risk",
    severity: "high",
    athlete: {
      name: "Sarah Johnson",
      avatar: "/avatars/sarah.jpg",
      position: "Forward"
    },
    title: "Critical Risk Level Reached",
    description: "Risk score has increased to 78 over the past 3 days. Immediate attention required.",
    timestamp: "2 hours ago",
    status: "active",
    riskScore: 78
  },
  {
    id: 2,
    type: "missed_report",
    severity: "medium",
    athlete: {
      name: "Mike Chen",
      avatar: "/avatars/mike.jpg",
      position: "Midfielder"
    },
    title: "Missed Daily Report",
    description: "No daily wellness report submitted for 2 consecutive days.",
    timestamp: "1 day ago",
    status: "active",
    riskScore: 45
  },
  {
    id: 3,
    type: "trend_warning",
    severity: "medium",
    athlete: {
      name: "Emma Davis",
      avatar: "/avatars/emma.jpg",
      position: "Defender"
    },
    title: "Increasing Risk Trend",
    description: "Risk score has been steadily increasing over the past week (+15 points).",
    timestamp: "3 hours ago",
    status: "acknowledged",
    riskScore: 52
  },
  {
    id: 4,
    type: "recovery_concern",
    severity: "low",
    athlete: {
      name: "Jordan Smith",
      avatar: "/avatars/jordan.jpg",
      position: "Forward"
    },
    title: "Poor Recovery Metrics",
    description: "Sleep quality below 6/10 for 3 consecutive nights.",
    timestamp: "5 hours ago",
    status: "resolved",
    riskScore: 38
  },
  {
    id: 5,
    type: "training_load",
    severity: "high",
    athlete: {
      name: "Alex Rodriguez",
      avatar: "/avatars/alex.jpg",
      position: "Goalkeeper"
    },
    title: "Excessive Training Load",
    description: "Training load 40% above recommended level for current fitness state.",
    timestamp: "1 hour ago",
    status: "active",
    riskScore: 65
  }
]

const getAlertIcon = (type: string) => {
  switch (type) {
    case "high_risk":
      return <AlertTriangle className="h-4 w-4 text-high" />
    case "missed_report":
      return <Clock className="h-4 w-4 text-monitor" />
    case "trend_warning":
      return <AlertTriangle className="h-4 w-4 text-monitor" />
    case "recovery_concern":
      return <Clock className="h-4 w-4 text-muted-foreground" />
    case "training_load":
      return <AlertTriangle className="h-4 w-4 text-high" />
    default:
      return <AlertTriangle className="h-4 w-4" />
  }
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "high":
      return "high"
    case "medium":
      return "monitor"
    case "low":
      return "outline"
    default:
      return "outline"
  }
}

export function CoachAlerts() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Alerts</h1>
          <p className="text-muted-foreground">Monitor and manage team alerts and notifications</p>
        </div>
        <Button variant="outline">
          <CheckCircle className="h-4 w-4 mr-2" />
          Mark All Read
        </Button>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-high">3</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">High Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-high">2</div>
            <p className="text-xs text-muted-foreground">Critical alerts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Acknowledged</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-monitor">1</div>
            <p className="text-xs text-muted-foreground">Being addressed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resolved Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-safe">1</div>
            <p className="text-xs text-muted-foreground">Successfully handled</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search alerts..." className="pl-10" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="acknowledged">Acknowledged</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.map((alert) => (
          <Card key={alert.id} className={`${alert.status === 'resolved' ? 'opacity-60' : ''}`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground">{alert.title}</h3>
                        <Badge variant={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        <Badge 
                          variant={alert.status === 'active' ? 'high' : alert.status === 'acknowledged' ? 'monitor' : 'safe'}
                        >
                          {alert.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={alert.athlete.avatar} />
                            <AvatarFallback className="text-xs">
                              {alert.athlete.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{alert.athlete.name}</span>
                          <span className="text-xs text-muted-foreground">({alert.athlete.position})</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Risk Score: <span className="font-medium">{alert.riskScore}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">{alert.timestamp}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {alert.status === 'active' && (
                        <>
                          <Button size="sm" variant="outline">
                            Acknowledge
                          </Button>
                          <Button size="sm">
                            Resolve
                          </Button>
                        </>
                      )}
                      {alert.status === 'acknowledged' && (
                        <Button size="sm">
                          Resolve
                        </Button>
                      )}
                      <Button size="sm" variant="ghost">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alert Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Guidelines</CardTitle>
          <CardDescription>Understanding alert types and recommended actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>High Risk Alerts:</strong> Immediate intervention required. Contact athlete and consider modifying training load or scheduling additional recovery.
              </AlertDescription>
            </Alert>
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                <strong>Missed Reports:</strong> Follow up with athlete to ensure consistent monitoring. Consider automated reminders or check-ins.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}