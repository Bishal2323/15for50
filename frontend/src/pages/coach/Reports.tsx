import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useUserStore } from "@/store/userStore"
import { getCoachAthletes, createCoachWeeklyReport } from "@/lib/api"
import { Modal } from "@/components/ui/modal"
// RiskFactorModal removed: manual risk submission no longer collected from users
// useRiskFactors removed in CoachReports: no manual risk factor submission

const weeklySchema = z.object({
  athleteId: z.string().min(1, "Select athlete"),
  weekStart: z.string().min(1, "Select week start date"),
  acwr: z.number().min(0).max(3),
  quadricepsLsi: z.number().min(0).max(150),
  hamstringsLsi: z.number().min(0).max(150),
  singleLegHopLsi: z.number().min(0).max(150),
  yBalanceAnteriorDiffCm: z.number().min(0).max(50),
  lessScore: z.number().min(0).max(20),
  slsStabilitySec: z.number().min(0).max(300),
  specificPainChecks: z.array(z.object({
    area: z.string().min(1),
    rating: z.number().min(0).max(10),
  })).optional(),
  notes: z.string().optional(),
})

type WeeklyForm = z.infer<typeof weeklySchema>

type AthleteLite = { _id: string; email: string }

function toWeekStart(dateStr: string): string {
  const d = new Date(dateStr)
  const day = d.getDay() // 0 Sun .. 6 Sat
  const diffToMonday = (day === 0 ? -6 : 1) - day
  const monday = new Date(d)
  monday.setDate(d.getDate() + diffToMonday)
  monday.setHours(0, 0, 0, 0)
  return monday.toISOString().slice(0, 10)
}

function storageKey(coachId: string, athleteId: string, weekStart: string) {
  return `weekly_report:${coachId}:${athleteId}:${weekStart}`
}

export function CoachReports() {
  const { user } = useUserStore()
  const coachId = user?.id || "coach"

  const [athletes, setAthletes] = useState<AthleteLite[]>([])
  const [loadError, setLoadError] = useState<string>("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [athleteEmail, setAthleteEmail] = useState("")
  // Risk factor modal and manual submission removed

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await getCoachAthletes().catch(() => null)
        if (!active) return
        if (res && Array.isArray(res.athletes)) {
          setAthletes(res.athletes.map(a => ({ _id: a._id, email: a.email })))
        } else {
          setLoadError("Couldn’t fetch athletes; using manual entry")
        }
      } catch (e) {
        setLoadError("Couldn’t fetch athletes; using manual entry")
      }
    })()
    return () => { active = false }
  }, [])

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<WeeklyForm>({
    resolver: zodResolver(weeklySchema),
    defaultValues: {
      athleteId: "",
      weekStart: toWeekStart(new Date().toISOString().slice(0, 10)),
      acwr: 1.0,
      quadricepsLsi: 95,
      hamstringsLsi: 93,
      singleLegHopLsi: 95,
      yBalanceAnteriorDiffCm: 3.0,
      lessScore: 4,
      slsStabilitySec: 28,
      specificPainChecks: [{ area: "Knee (Right)", rating: 0 }],
      notes: "",
    }
  })

  const values = watch()

  const [saved, setSaved] = useState(false)

  const onSubmit = async (data: WeeklyForm) => {
    const wkStart = toWeekStart(data.weekStart)
    setValue("weekStart", wkStart)
    if (!athleteEmail) {
      // Fallback: try to match selected athleteId to email from list
      const selected = athletes.find(a => a._id === data.athleteId)
      const emailToUse = selected?.email || ""
      if (!emailToUse) {
        alert("Please select an athlete (email) before saving.")
        return
      }
      try {
        const res = await createCoachWeeklyReport({
          athleteEmail: emailToUse,
          weekStart: wkStart,
          title: `Week of ${wkStart}`,
          trainingFocus: undefined,
          notes: data.notes,
          // Coach factors
          acwr: data.acwr,
          quadricepsLsi: data.quadricepsLsi,
          hamstringsLsi: data.hamstringsLsi,
          singleLegHopLsi: data.singleLegHopLsi,
          yBalanceAnteriorDiffCm: data.yBalanceAnteriorDiffCm,
          lessScore: data.lessScore,
          slsStabilitySec: data.slsStabilitySec,
          specificPainChecks: data.specificPainChecks || [],
        })
        
        // Risk factor modal removed; just show saved state
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
      } catch (e: any) {
        alert(e?.message || "Failed to save weekly report")
      }
      return
    }

    try {
      const res = await createCoachWeeklyReport({
        athleteEmail,
        weekStart: wkStart,
        title: `Week of ${wkStart}`,
        trainingFocus: undefined,
        notes: data.notes,
        // Coach factors
        acwr: data.acwr,
        quadricepsLsi: data.quadricepsLsi,
        hamstringsLsi: data.hamstringsLsi,
        singleLegHopLsi: data.singleLegHopLsi,
        yBalanceAnteriorDiffCm: data.yBalanceAnteriorDiffCm,
        lessScore: data.lessScore,
        slsStabilitySec: data.slsStabilitySec,
        specificPainChecks: data.specificPainChecks || [],
      })
      
      // Risk factor modal removed; just show saved state
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (e: any) {
      alert(e?.message || "Failed to save weekly report")
    }
  }

  // Manual risk factor submission removed

  const recentReports = useMemo(() => {
    if (!values.athleteId) return [] as Array<{ weekStart: string; acwr: number }>
    const prefix = `weekly_report:${coachId}:${values.athleteId}:`
    const entries: Array<{ weekStart: string; acwr: number }> = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i) || ""
      if (k.startsWith(prefix)) {
        try {
          const v = JSON.parse(localStorage.getItem(k) || "{}")
          entries.push({ weekStart: v.weekStart, acwr: v.acwr })
        } catch {}
      }
    }
    return entries.sort((a, b) => a.weekStart.localeCompare(b.weekStart)).slice(-6)
  }, [values.athleteId, coachId])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Weekly Report</h1>
          <p className="text-muted-foreground">Coach-only inputs for Tier 2 metrics</p>
        </div>
      </div>

      {loadError && (
        <Alert>
          <AlertDescription>{loadError}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Report Details</CardTitle>
          <CardDescription>Select athlete and enter weekly metrics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="athleteEmail">Athlete Email</Label>
              <Input id="athleteEmail" placeholder="Type to search athletes"
                     value={athleteEmail}
                     onChange={(e) => {
                       const v = e.target.value
                       setAthleteEmail(v)
                       setSearchQuery(v)
                       if (v.trim().length > 0) setSearchOpen(true)
                     }} />
              <input type="hidden" {...register("athleteId")} />
              {errors.athleteId && (
                <p className="text-xs text-red-600">{errors.athleteId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="weekStart">Week Start (Mon)</Label>
              <Input type="date" id="weekStart" {...register("weekStart")} />
              {errors.weekStart && (
                <p className="text-xs text-red-600">{errors.weekStart.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="acwr">ACWR (ratio)</Label>
              <Input type="number" step="0.01" id="acwr" {...register("acwr", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quadricepsLsi">Quadriceps Strength LSI (%)</Label>
              <Input type="number" step="1" id="quadricepsLsi" {...register("quadricepsLsi", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hamstringsLsi">Hamstring Strength LSI (%)</Label>
              <Input type="number" step="1" id="hamstringsLsi" {...register("hamstringsLsi", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="singleLegHopLsi">Single-Leg Hop Distance LSI (%)</Label>
              <Input type="number" step="1" id="singleLegHopLsi" {...register("singleLegHopLsi", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="yBalanceAnteriorDiffCm">Modified Y-Balance (Anterior diff, cm)</Label>
              <Input type="number" step="0.1" id="yBalanceAnteriorDiffCm" {...register("yBalanceAnteriorDiffCm", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lessScore">LESS (total error count)</Label>
              <Input type="number" step="1" id="lessScore" {...register("lessScore", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slsStabilitySec">Single Leg Stance Stability (sec)</Label>
              <Input type="number" step="0.1" id="slsStabilitySec" {...register("slsStabilitySec", { valueAsNumber: true })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Specific Strain/Pain Check (NRS 0–10)</Label>
            <div className="space-y-2">
              {(values.specificPainChecks || []).map((pc, idx) => (
                <div key={idx} className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Area (e.g., Knee Right)"
                    value={pc.area}
                    onChange={(e) => {
                      const next = [...(values.specificPainChecks || [])]
                      next[idx] = { ...next[idx], area: e.target.value }
                      setValue("specificPainChecks", next, { shouldValidate: true })
                    }}
                  />
                  <Input
                    type="number"
                    min={0}
                    max={10}
                    step={1}
                    value={pc.rating}
                    onChange={(e) => {
                      const val = Number(e.target.value)
                      const next = [...(values.specificPainChecks || [])]
                      next[idx] = { ...next[idx], rating: val }
                      setValue("specificPainChecks", next, { shouldValidate: true })
                    }}
                  />
                </div>
              ))}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const next = [...(values.specificPainChecks || [])]
                    next.push({ area: "", rating: 0 })
                    setValue("specificPainChecks", next, { shouldValidate: true })
                  }}
                >
                  Add Check
                </Button>
                {values.specificPainChecks && values.specificPainChecks.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      const next = [...(values.specificPainChecks || [])]
                      next.pop()
                      setValue("specificPainChecks", next, { shouldValidate: true })
                    }}
                  >
                    Remove Last
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" rows={3} placeholder="Optional context"
                      {...register("notes")} />
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handleSubmit(onSubmit)}>Save Weekly Report</Button>
            {saved && <span className="text-sm text-green-600">Saved</span>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Entries</CardTitle>
          <CardDescription>Last 6 weeks for selected athlete</CardDescription>
        </CardHeader>
        <CardContent>
          {values.athleteId ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left">
                    <th className="px-2 py-1">Week Start</th>
                    <th className="px-2 py-1">ACWR</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReports.map((r) => (
                    <tr key={r.weekStart} className="border-t">
                      <td className="px-2 py-1">{r.weekStart}</td>
                      <td className="px-2 py-1">{r.acwr}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground">Select an athlete to view saved reports.</p>
          )}
        </CardContent>
      </Card>

      <Modal open={searchOpen} onClose={() => setSearchOpen(false)} title="Select Athlete">
        <div className="space-y-3">
          <Input placeholder="Search by email" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <div className="max-h-64 overflow-y-auto">
            {athletes
              .filter(a => a.email.toLowerCase().includes(searchQuery.toLowerCase()))
              .map(a => (
                <button
                  key={a._id}
                  className="w-full text-left px-3 py-2 rounded hover:bg-accent"
                  onClick={() => {
                    setValue("athleteId", a._id, { shouldValidate: true })
                    setAthleteEmail(a.email)
                    setSearchOpen(false)
                  }}
                >
                  {a.email}
                </button>
              ))}
            {athletes.length === 0 && (
              <p className="text-sm text-muted-foreground">No athletes loaded. Try again later.</p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setSearchOpen(false)}>Close</Button>
          </div>
        </div>
      </Modal>

      {/* Risk factor modal removed */}
    </div>
  )
}
