import { Calendar, TrendingUp, AlertTriangle, Activity, Target, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RiskIndicator } from "@/components/custom/RiskIndicator"
import { RiskChart } from "@/components/custom/RiskChart"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { useUserStore } from "@/store/userStore"
import { AthleteOnboardingModal } from "@/components/athlete/AthleteOnboardingModal"

// Mock data
const riskData = [
  { date: "Mon", risk: 25, fatigue: 30, stress: 20 },
  { date: "Tue", risk: 35, fatigue: 45, stress: 30 },
  { date: "Wed", risk: 45, fatigue: 55, stress: 40 },
  { date: "Thu", risk: 30, fatigue: 35, stress: 25 },
  { date: "Fri", risk: 40, fatigue: 50, stress: 35 },
  { date: "Sat", risk: 20, fatigue: 25, stress: 15 },
  { date: "Sun", risk: 15, fatigue: 20, stress: 10 },
]

const todayMetrics = {
  currentRisk: 35,
  fatigue: 45,
  stress: 30,
  sleep: 7.5,
  readiness: 75
}

const upcomingEvents = [
  { id: 1, title: "Training Session", time: "09:00 AM", type: "training" },
  { id: 2, title: "Strength Assessment", time: "02:00 PM", type: "assessment" },
  { id: 3, title: "Recovery Session", time: "04:00 PM", type: "recovery" },
]

const recentAlerts = [
  { id: 1, message: "Elevated fatigue levels detected", severity: "warning", time: "2 hours ago" },
  { id: 2, message: "Great recovery metrics today!", severity: "success", time: "1 day ago" },
]

export function AthleteDashboard() {
  const { user, isNewSignup, clearNewSignupFlag } = useUserStore()
  const [onboardingOpen, setOnboardingOpen] = useState(false)

  useEffect(() => {
    // Show onboarding only for new signups who are missing core profile data
    const needsOnboarding = user?.role === 'athlete' && isNewSignup && (
      !user?.heightCm || !user?.weightKg || !user?.age
    )
    setOnboardingOpen(Boolean(needsOnboarding))
  }, [user, isNewSignup])

  const handleOnboardingClose = () => {
    setOnboardingOpen(false)
    clearNewSignupFlag()
  }

  return (
    <div className="space-y-6">
      <AthleteOnboardingModal open={onboardingOpen} onClose={handleOnboardingClose} />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your ACL risk overview.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/athlete/report">
              <Activity className="h-4 w-4 mr-2" />
              Daily Report
            </Link>
          </Button>
        </div>
      </div>

      {/* Current Risk Status */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Current Risk Status
          </CardTitle>
          <CardDescription>Your current ACL injury risk assessment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <RiskIndicator 
              score={todayMetrics.currentRisk} 
              size="lg" 
              showProgress 
              className="flex-1"
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
              <div className="text-center">
                <p className="text-2xl font-bold text-monitor">{todayMetrics.fatigue}%</p>
                <p className="text-sm text-muted-foreground">Fatigue</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-high">{todayMetrics.stress}%</p>
                <p className="text-sm text-muted-foreground">Stress</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-safe">{todayMetrics.sleep}h</p>
                <p className="text-sm text-muted-foreground">Sleep</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{todayMetrics.readiness}%</p>
                <p className="text-sm text-muted-foreground">Readiness</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Trend Chart */}
        <div className="lg:col-span-2">
          <RiskChart 
            data={riskData}
            title="7-Day Risk Trend"
            description="Your ACL injury risk over the past week"
            type="area"
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
            <CardDescription>Upcoming activities and assessments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-sm">{event.title}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {event.time}
                  </p>
                </div>
                <Badge variant={
                  event.type === 'training' ? 'default' :
                  event.type === 'assessment' ? 'secondary' : 'outline'
                }>
                  {event.type}
                </Badge>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full mt-3" asChild>
              <Link to="/athlete/calendar">View Full Calendar</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Recent Alerts
            </CardTitle>
            <CardDescription>Important notifications about your health status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className={`h-2 w-2 rounded-full mt-2 ${
                  alert.severity === 'warning' ? 'bg-monitor' :
                  alert.severity === 'success' ? 'bg-safe' : 'bg-high'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full">
              View All Alerts
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/athlete/report">
                <Activity className="h-4 w-4 mr-2" />
                Submit Daily Report
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/athlete/trends">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Risk Trends
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link to="/athlete/calendar">
                <Calendar className="h-4 w-4 mr-2" />
                Check Schedule
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
