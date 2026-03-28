import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'
import api from '@/lib/api'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  fetchUser: () => Promise<void>
  setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const response = await api.post('/auth/login/', { email, password })
        const { access, refresh } = response.data

        localStorage.setItem('access_token', access)
        localStorage.setItem('refresh_token', refresh)

        const userResponse = await api.get('/auth/users/me/')
        set({ user: userResponse.data, isAuthenticated: true })
      },

      logout: () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        set({ user: null, isAuthenticated: false })
      },

      fetchUser: async () => {
        try {
          const response = await api.get('/auth/users/me/')
          set({ user: response.data, isAuthenticated: true })
        } catch (error) {
          set({ user: null, isAuthenticated: false })
        }
      },

      setUser: (user) => {
        set({ user, isAuthenticated: !!user })
      },
    }),
    {
      name: 'auth-storage',
      skipHydration: true,
    }
  )
)
