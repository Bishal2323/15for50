import { Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Modal } from "@/components/ui/modal"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createPatient, deletePatient, getMyPatients, updatePatient, type Patient, type Severity } from "@/lib/api"

// type Severity = 'small' | 'middle' | 'severe'
// type PatientEntry = { id: string; name: string; details: string; severity: Severity }

export function PhysioPatients() {
  const [addOpen, setAddOpen] = useState(false)
  const [name, setName] = useState("")
  const [details, setDetails] = useState("")
  const [severity, setSeverity] = useState<Severity | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["physio-patients"],
    queryFn: getMyPatients,
  })

  const patients = data?.patients || []

  const createMut = useMutation({
    mutationFn: () => createPatient({ name: name.trim(), details: details.trim(), severity: severity as Severity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["physio-patients"] })
    },
  })

  const updateMut = useMutation({
    mutationFn: (id: string) => updatePatient(id, { name: name.trim(), details: details.trim(), severity: severity as Severity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["physio-patients"] })
    },
  })

  const deleteMut = useMutation({
    mutationFn: (id: string) => deletePatient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["physio-patients"] })
    },
  })

  const resetForm = () => {
    setName("")
    setDetails("")
    setSeverity(null)
  }

  const handleSavePatient = async () => {
    setFormError(null)
    if (!name.trim() || !severity) return
    try {
      if (editingId) {
        await updateMut.mutateAsync(editingId)
      } else {
        await createMut.mutateAsync()
      }
      setAddOpen(false)
      setEditingId(null)
      resetForm()
    } catch (e) {
      const msg = (e as Error)?.message || 'Failed to save patient'
      setFormError(msg)
    }
  }

  const startAdd = () => {
    setEditingId(null)
    resetForm()
    setAddOpen(true)
  }

  const startEdit = (entry: Patient) => {
    setEditingId(entry._id)
    setName(entry.name)
    setDetails(entry.details)
    setSeverity(entry.severity)
    setAddOpen(true)
    setMenuOpenId(null)
  }

  const removeOne = (id: string) => {
    deleteMut.mutate(id)
    setMenuOpenId(null)
  }

  const toggleMenu = (id: string) => {
    setMenuOpenId((prev) => (prev === id ? null : id))
  }

  const severityLabel = (s: Severity) => {
    switch (s) {
      case 'small': return 'Small'
      case 'middle': return 'Middle'
      case 'severe': return 'Severe'
    }
  }

  const severityBadgeVariant = (s: Severity) => {
    switch (s) {
      case 'small': return 'outline'
      case 'middle': return 'safe'
      case 'severe': return 'high'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Patients</h1>
          <p className="text-muted-foreground">Add new patients and record injury details</p>
        </div>
        <Button onClick={startAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Patient
        </Button>
      </div>

      {/* Added Patients (minimal) */}
      <Card>
        <CardHeader>
          <CardTitle>Added Patients</CardTitle>
          <CardDescription>New entries you add here</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <p className="text-sm text-muted-foreground">Loading patients...</p>
          )}
          {isError && (
            <p className="text-sm text-destructive">{(error as Error)?.message || 'Failed to load patients'}</p>
          )}
          {!isLoading && patients.length === 0 ? (
            <p className="text-sm text-muted-foreground">No patients added yet.</p>
          ) : (
            <div className="space-y-3">
              {patients.map((p) => (
                <div key={p._id} className="relative flex items-start justify-between border rounded-md p-3">
                  <div className="space-y-1">
                    <div className="font-medium">{p.name}</div>
                    {p.details && (
                      <div className="text-sm text-muted-foreground">{p.details}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={severityBadgeVariant(p.severity)}>{severityLabel(p.severity)}</Badge>
                    <Button variant="ghost" size="icon" onClick={() => toggleMenu(p._id)}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                    {menuOpenId === p._id && (
                      <div className="absolute right-3 top-12 w-40 rounded-md border bg-popover shadow-md py-1 z-10">
                        <button
                          className="flex w-full items-center gap-2 px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                          onClick={() => startEdit(p)}
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          className="flex w-full items-center gap-2 px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                          onClick={() => removeOne(p._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Patient Modal */}
      <Modal open={addOpen} onClose={() => { setAddOpen(false); setEditingId(null); resetForm() }} title={editingId ? "Edit Patient" : "Add Patient"}>
        <div className="space-y-4">
          {formError && (
            <div className="text-sm text-destructive">{formError}</div>
          )}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Patient Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">What happened?</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
              placeholder="Describe the injury or incident"
              className="w-full rounded-md border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Injury severity</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSeverity('small')}
                className={`px-3 py-2 rounded-md border ${severity === 'small' ? 'ring-2 ring-primary' : ''} bg-white text-foreground`}
              >
                Small
              </button>
              <button
                type="button"
                onClick={() => setSeverity('middle')}
                className={`px-3 py-2 rounded-md ${severity === 'middle' ? 'ring-2 ring-primary' : ''} bg-green-500 text-white`}
              >
                Middle
              </button>
              <button
                type="button"
                onClick={() => setSeverity('severe')}
                className={`px-3 py-2 rounded-md ${severity === 'severe' ? 'ring-2 ring-primary' : ''} bg-red-500 text-white`}
              >
                Severe
              </button>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => { setAddOpen(false); setEditingId(null); resetForm() }}>Cancel</Button>
            <Button onClick={handleSavePatient} disabled={!name.trim() || !severity || createMut.isPending || updateMut.isPending}>{editingId ? (updateMut.isPending ? 'Saving...' : 'Save Changes') : (createMut.isPending ? 'Adding...' : 'Add Patient')}</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
