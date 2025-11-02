import { Users, AlertTriangle, TrendingUp, BarChart3, Calendar, Target } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RiskIndicator } from "@/components/custom/RiskIndicator"
import { RiskChart } from "@/components/custom/RiskChart"
import { RealTimeNotifications } from "@/components/notifications/RealTimeNotifications"
import { Link } from "react-router-dom"

// Mock data
const teamOverview = {
  totalAthletes: 24,
  highRiskAthletes: 3,
  averageRisk: 35,
  activeAlerts: 7
}

const riskTrendData = [
  { date: "Week 1", risk: 28 },
  { date: "Week 2", risk: 32 },
  { date: "Week 3", risk: 35 },
  { date: "Week 4", risk: 30 },
  { date: "Week 5", risk: 38 },
  { date: "Week 6", risk: 35 },
]

const highRiskAthletes = [
  { id: 1, name: "Alex Johnson", risk: 85, position: "Forward", lastReport: "2 hours ago", trend: "up" },
  { id: 2, name: "Sarah Williams", risk: 75, position: "Midfielder", lastReport: "4 hours ago", trend: "stable" },
  { id: 3, name: "Mike Chen", risk: 72, position: "Defender", lastReport: "1 hour ago", trend: "down" },
]

const recentAlerts = [
  { id: 1, athlete: "Alex Johnson", message: "Elevated fatigue and stress levels", severity: "high", time: "30 min ago" },
  { id: 2, athlete: "Sarah Williams", message: "Missed daily report submission", severity: "medium", time: "2 hours ago" },
  { id: 3, athlete: "Mike Chen", message: "Reported knee pain (Level 6)", severity: "high", time: "3 hours ago" },
  { id: 4, athlete: "Emma Davis", message: "Poor sleep quality for 3 days", severity: "medium", time: "5 hours ago" },
]

const upcomingEvents = [
  { id: 1, title: "Team Training", time: "10:00 AM", athletes: 18 },
  { id: 2, title: "Individual Assessments", time: "2:00 PM", athletes: 5 },
  { id: 3, title: "Recovery Session", time: "4:00 PM", athletes: 12 },
]

export function CoachDashboard() {
  return (
    <div className="space-y-6">
      {/* Real-time Notifications */}
      <RealTimeNotifications />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Coach Dashboard</h1>
          <p className="text-muted-foreground">Monitor your team's ACL injury risk and performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/coach/analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Link>
          </Button>
          <Button asChild>
            <Link to="/coach/athletes">
              <Users className="h-4 w-4 mr-2" />
              Manage Athletes
            </Link>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Athletes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamOverview.totalAthletes}</div>
            <p className="text-xs text-muted-foreground">Active team members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Athletes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-high" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-high">{teamOverview.highRiskAthletes}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Risk</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamOverview.averageRisk}%</div>
            <p className="text-xs text-muted-foreground">Team average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-monitor" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-monitor">{teamOverview.activeAlerts}</div>
            <p className="text-xs text-muted-foreground">Pending review</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Risk Trend */}
        <div className="lg:col-span-2">
          <RiskChart 
            data={riskTrendData}
            title="Team Risk Trend"
            description="Average team ACL injury risk over the past 6 weeks"
            type="line"
            height={350}
          />
        </div>

        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Schedule
            </CardTitle>
            <CardDescription>Upcoming team activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-sm">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.time}</p>
                </div>
                <Badge variant="secondary">
                  {event.athletes} athletes
                </Badge>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full mt-3">
              View Full Schedule
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* High Risk Athletes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-high" />
              High Risk Athletes
            </CardTitle>
            <CardDescription>Athletes requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {highRiskAthletes.map((athlete) => (
              <div key={athlete.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${athlete.name}`} />
                    <AvatarFallback>{athlete.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{athlete.name}</p>
                    <p className="text-xs text-muted-foreground">{athlete.position}</p>
                    <p className="text-xs text-muted-foreground">Last report: {athlete.lastReport}</p>
                  </div>
                </div>
                <div className="text-right">
                  <RiskIndicator score={athlete.risk} size="sm" />
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className={`h-3 w-3 ${
                      athlete.trend === 'up' ? 'text-high' :
                      athlete.trend === 'down' ? 'text-safe' : 'text-monitor'
                    }`} />
                    <span className="text-xs text-muted-foreground">{athlete.trend}</span>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to="/coach/athletes">View All Athletes</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Recent Alerts
            </CardTitle>
            <CardDescription>Latest notifications from your team</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className={`h-2 w-2 rounded-full mt-2 ${
                  alert.severity === 'high' ? 'bg-high' :
                  alert.severity === 'medium' ? 'bg-monitor' : 'bg-safe'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{alert.athlete}</p>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
                <Badge variant={
                  alert.severity === 'high' ? 'destructive' :
                  alert.severity === 'medium' ? 'secondary' : 'outline'
                }>
                  {alert.severity}
                </Badge>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to="/coach/alerts">View All Alerts</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}