import { Plus, Search, Filter, FileText, Calendar, CheckCircle, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

// Mock data
const assessments = [
  {
    id: 1,
    patient: {
      name: "Sarah Johnson",
      avatar: "/avatars/sarah.jpg",
      sport: "Soccer"
    },
    type: "Functional Movement Screen",
    status: "completed",
    score: 85,
    date: "2024-01-15",
    nextDue: "2024-02-15",
    notes: "Significant improvement in knee stability",
    priority: "high"
  },
  {
    id: 2,
    patient: {
      name: "Mike Chen",
      avatar: "/avatars/mike.jpg",
      sport: "Basketball"
    },
    type: "Strength Assessment",
    status: "pending",
    score: null,
    date: "2024-01-20",
    nextDue: "Today",
    notes: "Scheduled for 2:00 PM",
    priority: "medium"
  },
  {
    id: 3,
    patient: {
      name: "Emma Davis",
      avatar: "/avatars/emma.jpg",
      sport: "Soccer"
    },
    type: "Balance & Proprioception",
    status: "in_progress",
    score: null,
    date: "2024-01-18",
    nextDue: "Tomorrow",
    notes: "Partial completion - follow-up needed",
    priority: "medium"
  },
  {
    id: 4,
    patient: {
      name: "Alex Rodriguez",
      avatar: "/avatars/alex.jpg",
      sport: "Soccer"
    },
    type: "Return to Play Assessment",
    status: "completed",
    score: 92,
    date: "2024-01-12",
    nextDue: "2024-02-12",
    notes: "Cleared for full activity",
    priority: "low"
  }
]

const assessmentTypes = [
  "Functional Movement Screen",
  "Strength Assessment", 
  "Balance & Proprioception",
  "Return to Play Assessment",
  "Injury Risk Screening",
  "Movement Analysis"
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "safe"
    case "pending":
      return "monitor"
    case "in_progress":
      return "high"
    case "overdue":
      return "high"
    default:
      return "outline"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4" />
    case "pending":
      return <Clock className="h-4 w-4" />
    case "in_progress":
      return <FileText className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
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

export function PhysioAssessments() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Assessments</h1>
          <p className="text-muted-foreground">Manage patient assessments and evaluations</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Assessment
        </Button>
      </div>

      {/* Assessment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-monitor">8</div>
            <p className="text-xs text-muted-foreground">Due this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-high">3</div>
            <p className="text-xs text-muted-foreground">Partially completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-safe">15</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-safe">87</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search assessments..." className="pl-10" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {assessmentTypes.map((type) => (
              <SelectItem key={type} value={type.toLowerCase().replace(/\s+/g, '_')}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Assessments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Assessment Overview</CardTitle>
          <CardDescription>Track patient assessments and their progress</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Assessment Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Next Due</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assessments.map((assessment) => (
                <TableRow key={assessment.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={assessment.patient.avatar} />
                        <AvatarFallback>
                          {assessment.patient.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{assessment.patient.name}</div>
                        <div className="text-xs text-muted-foreground">{assessment.patient.sport}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{assessment.type}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(assessment.status)}
                      <Badge variant={getStatusColor(assessment.status)}>
                        {assessment.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {assessment.score ? (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{assessment.score}</span>
                        <div className="w-16 h-2 bg-muted rounded-full">
                          <div 
                            className={`h-full rounded-full ${
                              assessment.score >= 80 ? 'bg-safe' : 
                              assessment.score >= 60 ? 'bg-monitor' : 'bg-high'
                            }`}
                            style={{ width: `${assessment.score}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">{assessment.date}</TableCell>
                  <TableCell className="text-sm">
                    <span className={assessment.nextDue === 'Today' ? 'text-high font-medium' : ''}>
                      {assessment.nextDue}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(assessment.priority)}>
                      {assessment.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Assessment Templates</CardTitle>
            <CardDescription>Quick access to common assessment types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {assessmentTypes.map((type) => (
                <Button key={type} variant="outline" size="sm" className="justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  {type}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Completions</CardTitle>
            <CardDescription>Latest assessment results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">SJ</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">Sarah Johnson</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">85</span>
                  <Badge variant="safe" className="text-xs">Improved</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">AR</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">Alex Rodriguez</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">92</span>
                  <Badge variant="safe" className="text-xs">Cleared</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}