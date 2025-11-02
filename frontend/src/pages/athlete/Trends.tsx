import { ArrowLeft, Calendar, Shield, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AthleteRiskFactorChart from "@/components/custom/AthleteRiskFactorChart"
import { Link } from "react-router-dom"
import { useEffect, useMemo, useState } from "react"
import { useUserStore } from "@/store/userStore"
import { useRiskFactors } from "@/hooks/useRiskFactors"
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts'

type HistoryEntry = {
  metric: 'workloadManagement' | 'mentalRecovery' | string
  value: number
  date: string | Date
  reportType: string
}

type NoteEntry = { value?: string; note?: string; date?: string | Date }
export function AthleteTrends() {
  const { user } = useUserStore()
  const { getRiskFactorHistory, getRiskFactors, loading } = useRiskFactors()
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [notes, setNotes] = useState<NoteEntry[]>([])
  const [currentFactors, setCurrentFactors] = useState<{
    strengthAsymmetry?: number
    neuromuscularControl?: number
    anatomicalFixedRisk?: number
  } | null>(null)
  // Hover tooltips are overlayed and do not change layout height

  const dateFmt = (d: Date) => d.toISOString().split('T')[0]
  const addDays = (d: Date, delta: number) => new Date(d.getTime() + delta * 24 * 60 * 60 * 1000)

  useEffect(() => {
    let mounted = true
    const fetchHistory = async () => {
      if (!user?.id) return
      try {
        // Always show last 7 days
        const end = new Date()
        const start = addDays(end, -6)
        const data = await getRiskFactorHistory(user.id, {
          reportType: 'daily',
          startDate: dateFmt(start),
          endDate: dateFmt(end),
          limit: 200,
        })
        const entries: HistoryEntry[] = (data?.data?.history) || data?.history || data || []
        const sorted = entries
          .filter((e) => e?.date)
          .sort((a, b) => new Date(a.date as any).getTime() - new Date(b.date as any).getTime())
        if (mounted) {
          setHistory(sorted)
          const last = sorted[sorted.length - 1]
          setSelectedDate(last ? dateFmt(new Date(last.date as any)) : '')
        }
      } catch (e) {
        // Silently fail, display empty chart
        if (mounted) {
          setHistory([])
          setSelectedDate('')
        }
      }
    }
    fetchHistory()
    return () => { mounted = false }
  }, [user?.id, getRiskFactorHistory])

  // Fetch notes once (and when user changes)
  useEffect(() => {
    let mounted = true
    const fetchNotes = async () => {
      if (!user?.id) return
      try {
        const data = await getRiskFactors(user.id)
        const list: NoteEntry[] = (data as any)?.notes || []
        if (mounted) setNotes(list)
        const cf = (data as any)?.currentRiskFactors
        if (mounted && cf) {
          setCurrentFactors({
            strengthAsymmetry: Number(cf.strengthAsymmetry) || 0,
            neuromuscularControl: Number(cf.neuromuscularControl) || 0,
            anatomicalFixedRisk: Number(cf.anatomicalFixedRisk) || 0,
          })
        }
      } catch { }
    }
    fetchNotes()
    return () => { mounted = false }
  }, [user?.id, getRiskFactors])

  const chartData = useMemo(() => {
    const byDate: Record<string, { date: string; workloadManagement?: number; mentalRecovery?: number }> = {}
    for (const h of history) {
      const d = dateFmt(new Date(h.date as any))
      if (!byDate[d]) byDate[d] = { date: d }
      if (h.metric === 'workloadManagement') byDate[d].workloadManagement = Number(h.value)
      if (h.metric === 'mentalRecovery') byDate[d].mentalRecovery = Number(h.value)
    }
    return Object.values(byDate).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [history])

  const availableDates = useMemo(() => chartData.map((d) => d.date), [chartData])

  const notesForSelected = useMemo(() => {
    const target = selectedDate
    const dayNotes = notes
      .filter((n) => n?.date && dateFmt(new Date(n.date as any)) === target)
      .map((n) => (n.note ?? n.value ?? ''))
      .filter((s) => typeof s === 'string' && s.length > 0) as string[]
    return dayNotes
  }, [notes, selectedDate])

  const clampFactor = (v?: number | null): number | null => {
    if (v === null || v === undefined) return null
    const num = Number(v)
    if (!Number.isFinite(num)) return null
    return Math.max(0, Math.min(10, num))
  }

  const strengthVal = useMemo(() => clampFactor(currentFactors?.strengthAsymmetry), [currentFactors])
  const neuroVal = useMemo(() => clampFactor(currentFactors?.neuromuscularControl), [currentFactors])
  const anatomicalVal = useMemo(() => clampFactor(currentFactors?.anatomicalFixedRisk), [currentFactors])

  const makePieData = (val: number | null) => {
    if (val === null) return [{ name: 'N/A', value: 10 }]
    const filled = Math.max(0, Math.min(10, val))
    const remainder = Math.max(0, 10 - filled)
    return [
      { name: 'Filled', value: filled },
      { name: 'Remaining', value: remainder },
    ]
  }

  const colors = {
    strength: '#6366f1',
    neuro: '#f59e0b',
    anatomical: '#10b981',
    remainder: '#e5e7eb',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/athlete">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">Risk Trends</h1>
          <p className="text-muted-foreground">Workload management and mental recovery over time</p>
        </div>
      </div>

      {/* ACL Risk Highlight */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" /> ACL Risk
          </CardTitle>
          <CardDescription>
            This is a single, high-importance indicator derived from five factors:
            workload management, mental recovery, strength asymmetry, neuromuscular control, and anatomical risk.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground">Current ACL Risk</div>
                <div className="relative group">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    aria-label="About current ACL risk"
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                  <div className="pointer-events-none absolute left-1/2 top-full -translate-x-1/2 mt-2 w-64 rounded-md border bg-popover text-popover-foreground shadow-md p-2 opacity-0 group-hover:opacity-100 z-50">
                    ACL risk combines multiple contributors. Anatomical and strength asymmetry have strong influence,
                    neuromuscular control is also important, while mental recovery and workload management contribute with lower weight.
                  </div>
                </div>
              </div>
              <div className="text-4xl font-bold">
                {typeof user?.aclRisk === 'number' ? `${Math.round(user.aclRisk)}%` : '—'}
              </div>
            </div>
          </div>

          {/* Separate factor pies */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Strength Asymmetry */}
            <div className="w-full h-[220px]">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-sm font-medium">Strength Asymmetry</div>
                <div className="relative group">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    aria-label="About strength asymmetry"
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                  <div className="pointer-events-none absolute left-1/2 top-full -translate-x-1/2 mt-2 w-64 rounded-md border bg-popover text-popover-foreground shadow-md p-2 opacity-0 group-hover:opacity-100 z-50">
                    Captures between-limb strength symmetry and H:Q ratio, including LSI metrics (quadriceps/hamstrings, hop tests, MVIC).
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={makePieData(strengthVal)}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={0}
                    outerRadius={80}
                  >
                    {makePieData(strengthVal).map((_, idx) => (
                      <Cell key={`strength-${idx}`} fill={idx === 0 ? colors.strength : colors.remainder} />
                    ))}
                    <Label value={strengthVal === null ? 'Data unavailable' : String(strengthVal)} position="center" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Neuromuscular Control */}
            <div className="w-full h-[220px]">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-sm font-medium">Neuromuscular Control</div>
                <div className="relative group">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    aria-label="About neuromuscular control"
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                  <div className="pointer-events-none absolute left-1/2 top-full -translate-x-1/2 mt-2 w-64 rounded-md border bg-popover text-popover-foreground shadow-md p-2 opacity-0 group-hover:opacity-100 z-50">
                    Reflects movement quality: dynamic knee valgus, LESS score, Y-Balance, trunk control, CMJ power, and stability.
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={makePieData(neuroVal)}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={0}
                    outerRadius={80}
                  >
                    {makePieData(neuroVal).map((_, idx) => (
                      <Cell key={`neuro-${idx}`} fill={idx === 0 ? colors.neuro : colors.remainder} />
                    ))}
                    <Label value={neuroVal === null ? 'Data unavailable' : String(neuroVal)} position="center" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Anatomical Risk */}
            <div className="w-full h-[220px]">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-sm font-medium">Anatomical Risk</div>
                <div className="relative group">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    aria-label="About anatomical risk"
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                  <div className="pointer-events-none absolute left-1/2 top-full -translate-x-1/2 mt-2 w-64 rounded-md border bg-popover text-popover-foreground shadow-md p-2 opacity-0 group-hover:opacity-100 z-50">
                    Includes fixed traits like joint laxity (Beighton), notch width, tibial slope, and knee laxity—often non‑modifiable.
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={makePieData(anatomicalVal)}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={0}
                    outerRadius={80}
                  >
                    {makePieData(anatomicalVal).map((_, idx) => (
                      <Cell key={`anatomical-${idx}`} fill={idx === 0 ? colors.anatomical : colors.remainder} />
                    ))}
                    <Label value={anatomicalVal === null ? 'Data unavailable' : String(anatomicalVal)} position="center" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Chart */}
      <AthleteRiskFactorChart
        data={chartData}
        title="Daily Risk Factors"
        description={loading ? 'Loading...' : 'Showing last 7 days (daily)'}
        height={380}
      />

      {/* Notes for selected date */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" /> Notes
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Date</span>
              <Select value={selectedDate} onValueChange={(v) => setSelectedDate(v)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select date" />
                </SelectTrigger>
                <SelectContent>
                  {availableDates.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <CardDescription>Contextual notes from daily reports</CardDescription>
        </CardHeader>
        <CardContent>
          {notesForSelected.length === 0 ? (
            <p className="text-sm text-muted-foreground">No notes available for the selected date.</p>
          ) : (
            <ul className="space-y-2">
              {notesForSelected.map((n, idx) => (
                <li key={idx} className="text-sm">• {n}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Shortcuts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" /> Quick Actions
          </CardTitle>
          <CardDescription>Navigate to daily reporting and calendar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link to="/athlete/report">Submit Daily Report</Link>
          </Button>
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link to="/athlete/calendar">View Calendar</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
