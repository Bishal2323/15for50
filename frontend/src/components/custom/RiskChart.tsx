import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface RiskDataPoint {
  date: string
  risk: number
  fatigue?: number
  stress?: number
}

interface RiskChartProps {
  data: RiskDataPoint[]
  title?: string
  description?: string
  type?: 'line' | 'area'
  height?: number
}

export function RiskChart({ 
  data, 
  title = "Risk Trend", 
  description = "ACL injury risk over time",
  type = 'line',
  height = 300 
}: RiskChartProps) {
  const getRiskColor = (value: number) => {
    if (value <= 30) return '#10b981' // safe - green
    if (value <= 70) return '#f59e0b' // monitor - amber
    return '#ef4444' // high - red
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const risk = payload[0].value
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-medium">Risk Score: </span>
              <span style={{ color: getRiskColor(risk) }}>
                {risk}%
              </span>
            </p>
            {payload[1] && (
              <p className="text-sm">
                <span className="font-medium">Fatigue: </span>
                <span>{payload[1].value}%</span>
              </p>
            )}
            {payload[2] && (
              <p className="text-sm">
                <span className="font-medium">Stress: </span>
                <span>{payload[2].value}%</span>
              </p>
            )}
          </div>
        </div>
      )
    }
    return null
  }

  const Chart = type === 'area' ? AreaChart : LineChart

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <Chart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date" 
              className="text-muted-foreground"
              fontSize={12}
            />
            <YAxis 
              className="text-muted-foreground"
              fontSize={12}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {type === 'area' ? (
              <>
                <defs>
                  <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="50%" stopColor="#f59e0b" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="risk"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#riskGradient)"
                />
              </>
            ) : (
              <Line
                type="monotone"
                dataKey="risk"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#6366f1', strokeWidth: 2 }}
              />
            )}
            
            {data[0]?.fatigue !== undefined && (
              <Line
                type="monotone"
                dataKey="fatigue"
                stroke="#f59e0b"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
              />
            )}
            
            {data[0]?.stress !== undefined && (
              <Line
                type="monotone"
                dataKey="stress"
                stroke="#ef4444"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
              />
            )}
          </Chart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}