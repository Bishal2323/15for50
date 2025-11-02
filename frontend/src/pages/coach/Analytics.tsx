import { BarChart3, TrendingUp, Users, AlertTriangle, Calendar, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RiskChart } from "@/components/custom/RiskChart"
import { Progress } from "@/components/ui/progress"

// Mock data
const teamTrendData = [
  { date: "Week 1", risk: 35, fatigue: 40, stress: 30 },
  { date: "Week 2", risk: 42, fatigue: 48, stress: 38 },
  { date: "Week 3", risk: 38, fatigue: 45, stress: 35 },
  { date: "Week 4", risk: 45, fatigue: 52, stress: 42 },
  { date: "Week 5", risk: 40, fatigue: 47, stress: 38 },
  { date: "Week 6", risk: 35, fatigue: 42, stress: 32 },
  { date: "Week 7", risk: 32, fatigue: 38, stress: 28 },
  { date: "Week 8", risk: 47, fatigue: 55, stress: 45 },
]

const riskDistribution = [
  { range: "0-25 (Safe)", count: 8, percentage: 40 },
  { range: "26-50 (Monitor)", count: 9, percentage: 45 },
  { range: "51-75 (High)", count: 2, percentage: 10 },
  { range: "76-100 (Critical)", count: 1, percentage: 5 },
]

const positionAnalysis = [
  { position: "Forward", avgRisk: 45, count: 6 },
  { position: "Midfielder", avgRisk: 38, count: 8 },
  { position: "Defender", avgRisk: 42, count: 7 },
  { position: "Goalkeeper", avgRisk: 25, count: 2 },
]

export function CoachAnalytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Deep insights into your team's ACL injury risk patterns</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="8weeks">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4weeks">4 Weeks</SelectItem>
              <SelectItem value="8weeks">8 Weeks</SelectItem>
              <SelectItem value="12weeks">12 Weeks</SelectItem>
              <SelectItem value="season">Full Season</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team Average Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-monitor">42.3</div>
            <p className="text-xs text-muted-foreground">↓ 5.2 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              High Risk Athletes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-high">3</div>
            <p className="text-xs text-muted-foreground">15% of team</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Risk Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-safe">Improving</div>
            <p className="text-xs text-muted-foreground">Last 4 weeks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Report Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-safe">87%</div>
            <p className="text-xs text-muted-foreground">Daily reports submitted</p>
          </CardContent>
        </Card>
      </div>

      {/* Team Risk Trend */}
      <RiskChart 
        data={teamTrendData}
        title="Team Risk Trend"
        description="Average risk, fatigue, and stress levels across your team"
        type="line"
        height={400}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
            <CardDescription>Current distribution of athletes across risk levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskDistribution.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{item.range}</span>
                    <span className="font-medium">{item.count} athletes ({item.percentage}%)</span>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Position Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Risk by Position</CardTitle>
            <CardDescription>Average risk scores by playing position</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {positionAnalysis.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{item.position}</span>
                    <span className="text-sm text-muted-foreground">({item.count})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-muted rounded-full">
                      <div 
                        className={`h-full rounded-full ${
                          item.avgRisk <= 25 ? 'bg-safe' : 
                          item.avgRisk <= 50 ? 'bg-monitor' : 'bg-high'
                        }`}
                        style={{ width: `${item.avgRisk}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-8">{item.avgRisk}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Training Load Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Light Training Days</span>
                <span className="font-medium text-safe">Avg Risk: 28</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Moderate Training Days</span>
                <span className="font-medium text-monitor">Avg Risk: 45</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Heavy Training Days</span>
                <span className="font-medium text-high">Avg Risk: 62</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recovery Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Good Sleep (&gt;7hrs)</span>
                <span className="font-medium text-safe">65% of team</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Adequate Recovery</span>
                <span className="font-medium text-monitor">78% of team</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>High Stress Levels</span>
                <span className="font-medium text-high">22% of team</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Injury Prevention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Prevention Exercises</span>
                <span className="font-medium text-safe">92% compliance</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Strength Training</span>
                <span className="font-medium text-monitor">85% compliance</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Flexibility Work</span>
                <span className="font-medium text-monitor">73% compliance</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}