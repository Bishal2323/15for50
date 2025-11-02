import { useState, useEffect } from "react"
import { Users, Shield, Database, BarChart3, Download, Settings, Activity, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RiskChart } from "@/components/custom/RiskChart"
import { Link } from "react-router-dom"
import { getAdminStats, type UserStats } from "@/lib/api"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Mock data
const systemOverview = {
  totalUsers: 156,
  activeUsers: 142,
  systemUptime: 99.8,
  dataPoints: 45678,
  storageUsed: 68,
  securityAlerts: 2
}

const userStats = [
  { role: "Athletes", count: 98, percentage: 63, color: "bg-blue-500" },
  { role: "Coaches", count: 24, percentage: 15, color: "bg-green-500" },
  { role: "Physiotherapists", count: 18, percentage: 12, color: "bg-purple-500" },
  { role: "Administrators", count: 16, percentage: 10, color: "bg-red-500" },
]

const systemMetrics = [
  { date: "Week 1", risk: 32, users: 145 },
  { date: "Week 2", risk: 35, users: 148 },
  { date: "Week 3", risk: 30, users: 152 },
  { date: "Week 4", risk: 38, users: 156 },
]

const recentActivity = [
  { id: 1, action: "New user registration", user: "Dr. Sarah Johnson", time: "5 min ago", type: "user" },
  { id: 2, action: "Data export completed", user: "System", time: "15 min ago", type: "system" },
  { id: 3, action: "Security scan completed", user: "System", time: "1 hour ago", type: "security" },
  { id: 4, action: "Database backup", user: "System", time: "2 hours ago", type: "system" },
  { id: 5, action: "User role updated", user: "Admin User", time: "3 hours ago", type: "user" },
]

const securityAlerts = [
  { id: 1, message: "Multiple failed login attempts detected", severity: "medium", time: "30 min ago" },
  { id: 2, message: "Unusual data access pattern", severity: "low", time: "2 hours ago" },
]

const systemHealth = {
  database: 98,
  api: 99,
  storage: 95,
  security: 97
}

export function AdminDashboard() {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const data = await getAdminStats()
        setStats(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-muted-foreground">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const userStats = stats ? [
    { role: "Athletes", count: stats.usersByRole.Athlete || 0, percentage: Math.round(((stats.usersByRole.Athlete || 0) / stats.totalUsers) * 100), color: "bg-blue-500" },
    { role: "Coaches", count: stats.usersByRole.Coach || 0, percentage: Math.round(((stats.usersByRole.Coach || 0) / stats.totalUsers) * 100), color: "bg-green-500" },
    { role: "Physiotherapists", count: stats.usersByRole.Physiotherapist || 0, percentage: Math.round(((stats.usersByRole.Physiotherapist || 0) / stats.totalUsers) * 100), color: "bg-purple-500" },
  ] : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">System Administration</h1>
          <p className="text-muted-foreground">Monitor system health, users, and security</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/admin/analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Link>
          </Button>
          <Button asChild>
            <Link to="/admin/users">
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Link>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              Registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Activity className="h-4 w-4 text-safe" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-safe">{systemOverview.systemUptime}%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Points</CardTitle>
            <Database className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{systemOverview.dataPoints.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total collected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
            <Shield className="h-4 w-4 text-monitor" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-monitor">{systemOverview.securityAlerts}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Metrics Chart */}
        <div className="lg:col-span-2">
          <RiskChart 
            data={systemMetrics}
            title="System Usage Trends"
            description="Platform usage and risk metrics over time"
            type="line"
            height={350}
          />
        </div>

        {/* User Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Distribution
            </CardTitle>
            <CardDescription>Breakdown by user roles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {userStats.map((stat) => (
              <div key={stat.role} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{stat.role}</span>
                  <span className="text-sm text-muted-foreground">{stat.count}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={stat.percentage} className="flex-1 h-2" />
                  <span className="text-xs text-muted-foreground w-8">{stat.percentage}%</span>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full mt-4" asChild>
              <Link to="/admin/users">Manage Users</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Health
            </CardTitle>
            <CardDescription>Current system component status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(systemHealth).map(([component, health]) => (
              <div key={component} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">{component}</span>
                  <span className={`text-sm font-medium ${
                    health >= 95 ? 'text-safe' :
                    health >= 90 ? 'text-monitor' : 'text-high'
                  }`}>
                    {health}%
                  </span>
                </div>
                <Progress 
                  value={health} 
                  className={`h-2 ${
                    health >= 95 ? '[&>div]:bg-safe' :
                    health >= 90 ? '[&>div]:bg-monitor' : '[&>div]:bg-high'
                  }`}
                />
              </div>
            ))}
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" className="flex-1">
                <Database className="h-4 w-4 mr-2" />
                Database
              </Button>
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link to="/admin/security">
                  <Shield className="h-4 w-4 mr-2" />
                  Security
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest system events and actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className={`h-2 w-2 rounded-full mt-2 ${
                  activity.type === 'security' ? 'bg-high' :
                  activity.type === 'user' ? 'bg-primary' : 'bg-safe'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.user}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {activity.type}
                </Badge>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full">
              View Activity Log
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Security Alerts */}
      {securityAlerts.length > 0 && (
        <Card className="border-l-4 border-l-monitor">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-monitor" />
              Security Alerts
            </CardTitle>
            <CardDescription>Issues requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {securityAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start justify-between p-3 rounded-lg bg-monitor/10 border border-monitor/20">
                <div>
                  <p className="text-sm font-medium">{alert.message}</p>
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
            <div className="flex gap-2">
              <Button size="sm" asChild>
                <Link to="/admin/security">
                  <Shield className="h-4 w-4 mr-2" />
                  Security Center
                </Link>
              </Button>
              <Button variant="outline" size="sm">
                Dismiss All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used administrative functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link to="/admin/export">
                <Download className="h-5 w-5" />
                <span className="text-xs">Export Data</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link to="/admin/users">
                <Users className="h-5 w-5" />
                <span className="text-xs">User Management</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link to="/admin/database">
                <Database className="h-5 w-5" />
                <span className="text-xs">Database</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <Link to="/admin/settings">
                <Settings className="h-5 w-5" />
                <span className="text-xs">Settings</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}