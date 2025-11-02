import { useEffect, useState } from 'react'
import { useUserStore } from '@/store/userStore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { updateMyProfile, getMe } from '@/lib/api'
import { toast } from 'sonner'

export function AthleteProfile() {
  const user = useUserStore((s) => s.user)
  const updateUser = useUserStore((s) => s.updateUser)

  const [name, setName] = useState<string>('')
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [age, setAge] = useState<number | ''>('')
  const [heightInches, setHeightInches] = useState<number | ''>('')
  const [weightPounds, setWeightPounds] = useState<number | ''>('')
  const [saving, setSaving] = useState(false)


  useEffect(() => {
    let active = true

    const fetchUserProfile = async () => {
      try {
        // Fetch fresh user data from backend to get complete profile
        const response = await getMe()
        const userData = response.user

        if (!active) return

        // Update local store with fresh data
        updateUser({
          name: userData.name,
          gender: userData.gender,
          age: userData.age,
          heightCm: userData.heightCm,
          weightKg: userData.weightKg,
          bmi: userData.bmi,
          aclRisk: typeof (userData as any).aclRisk === 'number' ? (userData as any).aclRisk : undefined,
        })

        // Populate form fields once on mount
        setName(userData.name || '')
        setGender(userData.gender === 'female' ? 'female' : 'male')
        setAge(typeof userData.age === 'number' ? userData.age : '')

        // Convert cm/kg to inches/pounds for display
        const inches = userData.heightCm ? Math.round((userData.heightCm / 2.54) * 10) / 10 : ''
        const pounds = userData.weightKg ? Math.round((userData.weightKg / 0.453592) * 10) / 10 : ''
        setHeightInches(inches as number | '')
        setWeightPounds(pounds as number | '')
      } catch (error) {
        console.error('Failed to fetch user profile:', error)
        // Fallback to user store data if API fails
        if (active && user) {
          setName(user.name || '')
          setGender(user.gender === 'female' ? 'female' : 'male')
          setAge(typeof user.age === 'number' ? user.age : '')
          const inches = user.heightCm ? Math.round((user.heightCm / 2.54) * 10) / 10 : ''
          const pounds = user.weightKg ? Math.round((user.weightKg / 0.453592) * 10) / 10 : ''
          setHeightInches(inches as number | '')
          setWeightPounds(pounds as number | '')
        }
      }
    }

    fetchUserProfile()

    return () => { active = false }
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      // Convert inches/pounds back to metric for backend
      const hCm = typeof heightInches === 'number' && heightInches > 0 ? heightInches * 2.54 : undefined
      const wKg = typeof weightPounds === 'number' && weightPounds > 0 ? weightPounds * 0.453592 : undefined
      const payload = {
        name: name || undefined,
        gender,
        age: typeof age === 'number' ? age : undefined,
        heightCm: hCm,
        weightKg: wKg,
      }
      const res = await updateMyProfile(payload)
      const u = res.user
      // Update local store; keep metric fields
      updateUser({
        name: String(u.name || name || ''),
        gender: String(u.gender || gender) === 'female' ? 'female' : 'male',
        age: typeof u.age === 'number' ? u.age : (typeof age === 'number' ? age : undefined),
        heightCm: typeof u.heightCm === 'number' ? u.heightCm : hCm,
        weightKg: typeof u.weightKg === 'number' ? u.weightKg : wKg,
        bmi: typeof u.bmi === 'number' ? u.bmi : undefined,
      })
      toast.success('Profile updated successfully')
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
        <p className="text-muted-foreground">Manage your personal information</p>
      </div>

      {/* Toasts are used for success/error notifications */}

      <div className="space-y-4">
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
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" disabled={saving} onClick={() => {
          // reset from current user data
          if (!user) return;
          setName(user.name || '')
          setGender(user.gender === 'female' ? 'female' : 'male')
          setAge(typeof user.age === 'number' ? user.age : '')
          const inches = user.heightCm ? Math.round((user.heightCm / 2.54) * 10) / 10 : ''
          const pounds = user.weightKg ? Math.round((user.weightKg / 0.453592) * 10) / 10 : ''
          setHeightInches(inches as number | '')
          setWeightPounds(pounds as number | '')
        }}>Reset</Button>
        <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
      </div>
    </div>
  )
}
