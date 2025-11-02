import { ArrowLeft, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AthleteRiskFactorChart from "@/components/custom/AthleteRiskFactorChart"
import { Link } from "react-router-dom"
import { useEffect, useMemo, useState } from "react"
import { useUserStore } from "@/store/userStore"
import { useRiskFactors } from "@/hooks/useRiskFactors"

type RangeOption = '7d' | '30d'

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
  const [range, setRange] = useState<RangeOption>('7d')
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [notes, setNotes] = useState<NoteEntry[]>([])

  const dateFmt = (d: Date) => d.toISOString().split('T')[0]
  const addDays = (d: Date, delta: number) => new Date(d.getTime() + delta * 24 * 60 * 60 * 1000)

  const rangeDates = useMemo(() => {
    const end = new Date()
    const start = range === '7d' ? addDays(end, -6) : addDays(end, -29)
    return { start: dateFmt(start), end: dateFmt(end) }
  }, [range])

  useEffect(() => {
    let mounted = true
    const fetchHistory = async () => {
      if (!user?.id) return
      try {
        const data = await getRiskFactorHistory(user.id, {
          reportType: 'daily',
          startDate: rangeDates.start,
          endDate: rangeDates.end,
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
  }, [user?.id, rangeDates.start, rangeDates.end, getRiskFactorHistory])

  // Fetch notes once (and when user changes)
  useEffect(() => {
    let mounted = true
    const fetchNotes = async () => {
      if (!user?.id) return
      try {
        const data = await getRiskFactors(user.id)
        const list: NoteEntry[] = (data as any)?.notes || []
        if (mounted) setNotes(list)
      } catch {}
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
        <div className="flex gap-2">
          <Select value={range} onValueChange={(v) => setRange(v as RangeOption)}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last month</SelectItem>
            </SelectContent>
          </Select>
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

      {/* Main Chart */}
      <AthleteRiskFactorChart
        data={chartData}
        title="Daily Risk Factors"
        description={loading ? 'Loading...' : `Showing ${range === '7d' ? 'last 7 days' : 'last month'} (daily)`}
        height={380}
      />

      {/* Notes for selected date */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" /> Notes on {selectedDate || '—'}
          </CardTitle>
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
