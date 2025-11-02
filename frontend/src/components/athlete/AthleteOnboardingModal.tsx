import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { postAthleteOnboarding } from '@/lib/api'
import { useUserStore } from '@/store/userStore'

interface AthleteOnboardingModalProps {
  open: boolean
  onClose: () => void
}

export function AthleteOnboardingModal({ open, onClose }: AthleteOnboardingModalProps) {
  const user = useUserStore((s) => s.user)
  const updateUser = useUserStore((s) => s.updateUser)

  const [name, setName] = useState<string>(user?.name || '')
  const [gender, setGender] = useState<'male' | 'female'>(user?.gender === 'female' ? 'female' : 'male')
  const [age, setAge] = useState<number | ''>(user?.age || '')
  const [heightInches, setHeightInches] = useState<number | ''>('')
  const [weightPounds, setWeightPounds] = useState<number | ''>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>('')

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError('')
    try {
      // Convert imperial inputs to metric for backend
      const hCm = typeof heightInches === 'number' && heightInches > 0 ? heightInches * 2.54 : undefined
      const wKg = typeof weightPounds === 'number' && weightPounds > 0 ? weightPounds * 0.453592 : undefined
      const payload = {
        name: name || undefined,
        gender,
        age: typeof age === 'number' ? age : undefined,
        heightCm: hCm,
        weightKg: wKg,
      }
      const res = await postAthleteOnboarding(payload)
      const u = res.user
      // Normalize and update local user store with received fields
      const normalized = {
        name: String(u.name || user?.name || ''),
        gender: String(u.gender || gender) === 'female' ? 'female' : 'male' as 'male' | 'female',
        age: typeof u.age === 'number' ? u.age : (typeof age === 'number' ? age : undefined),
        heightCm: typeof u.heightCm === 'number' ? u.heightCm : hCm,
        weightKg: typeof u.weightKg === 'number' ? u.weightKg : wKg,
        bmi: typeof u.bmi === 'number' ? u.bmi : undefined,
      }
      updateUser(normalized)
      onClose()
    } catch (err: any) {
      setError(err?.message || 'Failed to complete onboarding')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Welcome! Complete your profile">
      <div className="space-y-4">
        {error && (
          <div className="text-sm text-destructive">{error}</div>
        )}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Full Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Alex Smith" />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Gender</label>
          <Select value={gender} onValueChange={(val) => setGender(val as 'male' | 'female')}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Age</label>
            <Input type="number" min={0} value={age} onChange={(e) => {
              const v = e.target.value
              setAge(v === '' ? '' : Number(v))
            }} placeholder="e.g. 21" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Height (inches)</label>
            <Input type="number" min={0} value={heightInches} onChange={(e) => {
              const v = e.target.value
              setHeightInches(v === '' ? '' : Number(v))
            }} placeholder="e.g. 70" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Weight (pounds)</label>
            <Input type="number" min={0} value={weightPounds} onChange={(e) => {
              const v = e.target.value
              setWeightPounds(v === '' ? '' : Number(v))
            }} placeholder="e.g. 165" />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save and Continue'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
