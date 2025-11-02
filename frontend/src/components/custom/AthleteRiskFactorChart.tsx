import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export interface AthleteRiskPoint {
  date: string
  workloadManagement?: number
  mentalRecovery?: number
}

interface AthleteRiskFactorChartProps {
  data: AthleteRiskPoint[]
  title?: string
  description?: string
  height?: number
}

export function AthleteRiskFactorChart({
  data,
  title = 'Workload vs Mental Recovery',
  description = 'Daily risk factor trends',
  height = 340,
}: AthleteRiskFactorChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const workload = payload.find((p: any) => p.dataKey === 'workloadManagement')?.value
      const mental = payload.find((p: any) => p.dataKey === 'mentalRecovery')?.value
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-medium">Workload management: </span>
              <span>{workload ?? '-'}</span>
            </p>
            <p className="text-sm">
              <span className="font-medium">Mental recovery: </span>
              <span>{mental ?? '-'}</span>
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="date" className="text-muted-foreground" fontSize={12} />
            <YAxis className="text-muted-foreground" fontSize={12} domain={[0, 10]} ticks={[0,2,4,6,8,10]} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="workloadManagement"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ fill: '#6366f1', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 6, stroke: '#6366f1', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="mentalRecovery"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default AthleteRiskFactorChart
