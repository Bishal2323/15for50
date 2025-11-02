import { Users, Stethoscope, Target, Brain, Calendar, Activity, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { RiskIndicator } from "@/components/custom/RiskIndicator"
import { Link } from "react-router-dom"

// Mock data
const clinicOverview = {
  totalPatients: 18,
  pendingAssessments: 5,
  completedTests: 12,
  averageRecovery: 78
}

const upcomingAppointments = [
  { id: 1, patient: "Alex Johnson", time: "09:00 AM", type: "Initial Assessment", status: "confirmed" },
  { id: 2, patient: "Sarah Williams", time: "10:30 AM", type: "Strength Test", status: "confirmed" },
  { id: 3, patient: "Mike Chen", time: "02:00 PM", type: "Movement Analysis", status: "pending" },
  { id: 4, patient: "Emma Davis", time: "03:30 PM", type: "Follow-up", status: "confirmed" },
]

const recentAssessments = [
  { 
    id: 1, 
    patient: "Alex Johnson", 
    type: "Strength Test", 
    date: "Today", 
    riskScore: 75,
    findings: "Reduced quadriceps strength, asymmetry detected"
  },
  { 
    id: 2, 
    patient: "Sarah Williams", 
    type: "Movement Analysis", 
    date: "Yesterday", 
    riskScore: 45,
    findings: "Improved landing mechanics, good progress"
  },
  { 
    id: 3, 
    patient: "Mike Chen", 
    type: "Initial Assessment", 
    date: "2 days ago", 
    riskScore: 85,
    findings: "Multiple risk factors identified, requires intervention"
  },
]

const patientProgress = [
  { id: 1, name: "Alex Johnson", progress: 65, phase: "Strength Building", nextSession: "Tomorrow" },
  { id: 2, name: "Sarah Williams", progress: 85, phase: "Return to Sport", nextSession: "Friday" },
  { id: 3, name: "Mike Chen", progress: 30, phase: "Initial Recovery", nextSession: "Today" },
  { id: 4, name: "Emma Davis", progress: 92, phase: "Maintenance", nextSession: "Next Week" },
]

const testingQueue = [
  { id: 1, patient: "John Smith", test: "Hop Test", priority: "high", scheduled: "Today 2:00 PM" },
  { id: 2, patient: "Lisa Brown", test: "Y-Balance", priority: "medium", scheduled: "Tomorrow 10:00 AM" },
  { id: 3, patient: "David Wilson", test: "Strength Assessment", priority: "high", scheduled: "Friday 9:00 AM" },
]

export function PhysioDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Physiotherapy Dashboard</h1>
          <p className="text-muted-foreground">Monitor patient assessments and recovery progress</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/physio/assessments">
              <Stethoscope className="h-4 w-4 mr-2" />
              Assessments
            </Link>
          </Button>
          <Button asChild>
            <Link to="/physio/patients">
              <Users className="h-4 w-4 mr-2" />
              Patients
            </Link>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clinicOverview.totalPatients}</div>
            <p className="text-xs text-muted-foreground">Active caseload</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Assessments</CardTitle>
            <Stethoscope className="h-4 w-4 text-monitor" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-monitor">{clinicOverview.pendingAssessments}</div>
            <p className="text-xs text-muted-foreground">Awaiting evaluation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests Completed</CardTitle>
            <Target className="h-4 w-4 text-safe" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-safe">{clinicOverview.completedTests}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Recovery</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{clinicOverview.averageRecovery}%</div>
            <p className="text-xs text-muted-foreground">Patient progress</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Appointments
            </CardTitle>
            <CardDescription>Scheduled patient sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-sm">{appointment.patient}</p>
                  <p className="text-xs text-muted-foreground">{appointment.type}</p>
                  <p className="text-xs text-muted-foreground">{appointment.time}</p>
                </div>
                <Badge variant={
                  appointment.status === 'confirmed' ? 'default' :
                  appointment.status === 'pending' ? 'secondary' : 'outline'
                }>
                  {appointment.status}
                </Badge>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full mt-3">
              View Full Schedule
            </Button>
          </CardContent>
        </Card>

        {/* Testing Queue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Testing Queue
            </CardTitle>
            <CardDescription>Upcoming strength and movement tests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {testingQueue.map((test) => (
              <div key={test.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium text-sm">{test.patient}</p>
                  <p className="text-xs text-muted-foreground">{test.test}</p>
                  <p className="text-xs text-muted-foreground">{test.scheduled}</p>
                </div>
                <Badge variant={
                  test.priority === 'high' ? 'destructive' :
                  test.priority === 'medium' ? 'secondary' : 'outline'
                }>
                  {test.priority}
                </Badge>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to="/physio/strength">Manage Tests</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Patient Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Patient Progress
            </CardTitle>
            <CardDescription>Recovery status overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {patientProgress.map((patient) => (
              <div key={patient.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{patient.name}</p>
                    <p className="text-xs text-muted-foreground">{patient.phase}</p>
                  </div>
                  <span className="text-sm font-medium">{patient.progress}%</span>
                </div>
                <Progress value={patient.progress} className="h-2" />
                <p className="text-xs text-muted-foreground">Next: {patient.nextSession}</p>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to="/physio/patients">View All Patients</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Assessments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Recent Assessments
          </CardTitle>
          <CardDescription>Latest patient evaluations and findings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAssessments.map((assessment) => (
              <div key={assessment.id} className="flex items-start justify-between p-4 rounded-lg border">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${assessment.patient}`} />
                    <AvatarFallback>{assessment.patient.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{assessment.patient}</p>
                      <Badge variant="outline">{assessment.type}</Badge>
                      <span className="text-sm text-muted-foreground">{assessment.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{assessment.findings}</p>
                  </div>
                </div>
                <RiskIndicator score={assessment.riskScore} size="sm" />
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <Button variant="outline" asChild>
              <Link to="/physio/assessments">View All Assessments</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}