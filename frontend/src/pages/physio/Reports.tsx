import { useEffect, useState } from "react"
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
import { getPhysioUsers, type User, createPhysioReport, getPhysioReports } from "@/lib/api"
import { Modal } from "@/components/ui/modal"
// RiskFactorModal removed: manual risk submission no longer collected from users
// useRiskFactors removed in PhysioReports: no manual risk factor submission

const physioSchema = z.object({
  patientId: z.string().min(1, "Select patient"),
  assessmentDate: z.string().min(1, "Select assessment date"),
  hqRatio: z.number().min(0).max(200), // Ratio (%)
  peakDynamicKneeValgusDeg: z.number().min(0).max(90),
  trunkLeanLandingDeg: z.number().min(0).max(45),
  cmjPeakPowerWkg: z.number().min(0).max(100),
  beightonScore: z.number().min(0).max(9),
  anatomicalRisk: z.string().min(1), // text label e.g., Normal/Narrow Notch/High Slope
  mvicLsi: z.number().min(0).max(150),
  emgOnsetDelayMs: z.number().min(0).max(200),
  notes: z.string().optional(),
})

type PhysioForm = z.infer<typeof physioSchema>

export function PhysioReports() {
  const { user } = useUserStore()
  const physioId = user?.id || "physio"

  const [loadError, setLoadError] = useState<string>("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [patientName, setPatientName] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [recentReports, setRecentReports] = useState<Array<{ assessmentDate: string; hqRatio: number }>>([])
  // Risk factor modal and manual submission removed

  // Load users by email when searching
  useEffect(() => {
    let active = true
    const q = searchQuery.trim()
    if (!searchOpen || q.length === 0) {
      setUsers([])
      return
    }
    ; (async () => {
      try {
        const res = await getPhysioUsers({ search: q, limit: 10 })
        if (!active) return
        setUsers(res.users || [])
      } catch {
        setUsers([])
      }
    })()
    return () => { active = false }
  }, [searchOpen, searchQuery])

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<PhysioForm>({
    resolver: zodResolver(physioSchema),
    defaultValues: {
      patientId: "",
      assessmentDate: new Date().toISOString().slice(0, 10),
      hqRatio: 48,
      peakDynamicKneeValgusDeg: 12.5,
      trunkLeanLandingDeg: 4.0,
      cmjPeakPowerWkg: 45.0,
      beightonScore: 2,
      anatomicalRisk: "Normal",
      mvicLsi: 99,
      emgOnsetDelayMs: 15,
      notes: "",
    },
  })

  const values = watch()

  // Load recent reports when a patient is selected
  useEffect(() => {
    let active = true
      ; (async () => {
        const athleteId = values.patientId
        if (!athleteId) {
          setRecentReports([])
          return
        }
        try {
          const res = await getPhysioReports({ athleteId })
          if (!active) return
          const rows = (res.reports || [])
            .map((r: any) => ({ assessmentDate: r.assessmentDate, hqRatio: r.hqRatio }))
            .sort((a: any, b: any) => String(a.assessmentDate).localeCompare(String(b.assessmentDate)))
            .slice(-6)
          setRecentReports(rows)
        } catch (e: any) {
          setRecentReports([])
          setLoadError(e?.message || "Failed to load recent reports")
        }
      })()
    return () => { active = false }
  }, [values.patientId])

  const [saved, setSaved] = useState(false)

  const onSubmit = async (data: PhysioForm) => {
    try {
      await createPhysioReport({
        athleteId: data.patientId,
        assessmentDate: data.assessmentDate,
        hqRatio: data.hqRatio,
        peakDynamicKneeValgusDeg: data.peakDynamicKneeValgusDeg,
        trunkLeanLandingDeg: data.trunkLeanLandingDeg,
        cmjPeakPowerWkg: data.cmjPeakPowerWkg,
        beightonScore: data.beightonScore,
        anatomicalRisk: data.anatomicalRisk,
        mvicLsi: data.mvicLsi,
        emgOnsetDelayMs: data.emgOnsetDelayMs,
        notes: data.notes,
      })
      // Risk factor modal removed; just show saved state
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
      // refresh recent reports
      try {
        const res = await getPhysioReports({ athleteId: data.patientId })
        const rows = (res.reports || [])
          .map((r: any) => ({ assessmentDate: r.assessmentDate, hqRatio: r.hqRatio }))
          .sort((a: any, b: any) => String(a.assessmentDate).localeCompare(String(b.assessmentDate)))
          .slice(-6)
        setRecentReports(rows)
      } catch { }
    } catch (e: any) {
      setLoadError(e?.message || "Failed to save physio report")
    }
  }

  // Manual risk factor submission removed

  // recentReports now loaded from backend in effect above

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Physio Reports (Tier 3)</h1>
          <p className="text-muted-foreground">Physiotherapist-only inputs for monthly/seasonal metrics</p>
        </div>
      </div>

      {loadError && (
        <Alert>
          <AlertDescription>{loadError}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Assessment Details</CardTitle>
          <CardDescription>Select patient and enter Tier 3 metrics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientEmail">Patient Email</Label>
              <Input id="patientEmail" placeholder="Type to search by email"
                value={patientName}
                onChange={(e) => {
                  const v = e.target.value
                  setPatientName(v)
                  setSearchQuery(v)
                  if (v.trim().length > 0) setSearchOpen(true)
                }} />
              <input type="hidden" {...register("patientId")} />
              {errors.patientId && (
                <p className="text-xs text-red-600">{errors.patientId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="assessmentDate">Assessment Date</Label>
              <Input type="date" id="assessmentDate" {...register("assessmentDate")} />
              {errors.assessmentDate && (
                <p className="text-xs text-red-600">{errors.assessmentDate.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hqRatio">H:Q Ratio (%)</Label>
              <Input type="number" step="1" id="hqRatio" {...register("hqRatio", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="peakDynamicKneeValgusDeg">Peak Dynamic Knee Valgus (°)</Label>
              <Input type="number" step="0.1" id="peakDynamicKneeValgusDeg" {...register("peakDynamicKneeValgusDeg", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trunkLeanLandingDeg">Trunk Lean During Landing (°)</Label>
              <Input type="number" step="0.1" id="trunkLeanLandingDeg" {...register("trunkLeanLandingDeg", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cmjPeakPowerWkg">CMJ Peak Power (W/kg)</Label>
              <Input type="number" step="0.1" id="cmjPeakPowerWkg" {...register("cmjPeakPowerWkg", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="beightonScore">Beighton Score (0–9)</Label>
              <Input type="number" step="1" id="beightonScore" {...register("beightonScore", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anatomicalRisk">Anatomical Risk Factors</Label>
              <Input id="anatomicalRisk" placeholder="e.g., Normal / Narrow Notch / High Slope" {...register("anatomicalRisk")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mvicLsi">MVIC LSI (%)</Label>
              <Input type="number" step="1" id="mvicLsi" {...register("mvicLsi", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emgOnsetDelayMs">EMG Onset Timing (ms)</Label>
              <Input type="number" step="1" id="emgOnsetDelayMs" {...register("emgOnsetDelayMs", { valueAsNumber: true })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" rows={3} placeholder="Optional context" {...register("notes")} />
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handleSubmit(onSubmit)}>Save Physio Report</Button>
            {saved && <span className="text-sm text-green-600">Saved</span>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Entries</CardTitle>
          <CardDescription>Last 6 assessments for selected patient</CardDescription>
        </CardHeader>
        <CardContent>
          {values.patientId ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left">
                    <th className="px-2 py-1">Assessment Date</th>
                    <th className="px-2 py-1">H:Q (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReports.map((r) => (
                    <tr key={r.assessmentDate} className="border-t">
                      <td className="px-2 py-1">{r.assessmentDate}</td>
                      <td className="px-2 py-1">{r.hqRatio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground">Select a patient to view saved reports.</p>
          )}
        </CardContent>
      </Card>

      {/* Risk factor modal removed */}

      <Modal open={searchOpen} onClose={() => setSearchOpen(false)} title="Select Patient">
        <div className="space-y-3">
          <Input placeholder="Search by email" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <div className="max-h-64 overflow-y-auto">
            {users
              .filter(u => (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()))
              .map(u => (
                <button
                  key={u._id}
                  className="w-full text-left px-3 py-2 rounded hover:bg-accent"
                  onClick={() => {
                    setValue("patientId", u._id, { shouldValidate: true })
                    setPatientName(u.email)
                    setSearchOpen(false)
                  }}
                >
                  {u.email}
                </button>
              ))}
            {users.length === 0 && (
              <p className="text-sm text-muted-foreground">No users found. Try refining your search.</p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setSearchOpen(false)}>Close</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
