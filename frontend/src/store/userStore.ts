import { create } from 'zustand'
import type { User, UserRole } from '../types/user'

interface UserState {
  user: User | null
  isAuthenticated: boolean
  isNewSignup: boolean
  login: (user: User, isNewSignup?: boolean) => void
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  clearNewSignupFlag: () => void
}

export const useUserStore = create<UserState>((set) => {
  let initialUser: User | null = null
  let initialAuth = false

  try {
    const token = localStorage.getItem('access_token')
    const rawUser = localStorage.getItem('current_user')

    if (rawUser && token) {
      initialUser = JSON.parse(rawUser) as User
      initialAuth = true
    } else if (token) {
      // Fallback: decode JWT payload to reconstruct minimal user
      const parts = token.split('.')
      if (parts.length === 3) {
        try {
          const payload = JSON.parse(atob(parts[1])) as { id: string; email: string; role: string }
          const roleMap: Record<string, UserRole> = {
            Athlete: 'athlete',
            Coach: 'coach',
            Physiotherapist: 'physio',
            Admin: 'admin',
          }
          const role = roleMap[payload.role] || 'athlete'
          initialUser = {
            id: payload.id,
            email: payload.email,
            role,
            name: payload.email,
          }
          initialAuth = true
          // Persist for future loads
          localStorage.setItem('current_user', JSON.stringify(initialUser))
        } catch { }
      }
    }
  } catch { }

  return {
    user: initialUser,
    isAuthenticated: initialAuth,
    isNewSignup: false,

    login: (user, isNewSignup = false) => {
      try {
        localStorage.setItem('current_user', JSON.stringify(user))
      } catch { }
      set({ user, isAuthenticated: true, isNewSignup })
    },

    logout: () => {
      try {
        localStorage.removeItem('access_token')
        localStorage.removeItem('current_user')
      } catch { }
      set({ user: null, isAuthenticated: false, isNewSignup: false })
    },

    updateUser: (updates) => set((state) => {
      const nextUser = state.user ? { ...state.user, ...updates } : null
      try {
        if (nextUser) localStorage.setItem('current_user', JSON.stringify(nextUser))
      } catch { }
      return { user: nextUser }
    }),

    clearNewSignupFlag: () => set({ isNewSignup: false }),
  }
})
