import { create } from 'zustand'

interface User {
  id: string
  email: string
  name?: string
  image?: string
}

interface AuthState {
  user: User | null
  loading: boolean
  shouldFetch: boolean
  setUser: (user: User) => void
  clearUser: () => void
  setLoading: (loading: boolean) => void
  setShouldFetch: () => void
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,
  shouldFetch: false,
  setUser: (user) => set({ user, loading: false, shouldFetch: false }),
  clearUser: () => set({ user: null, loading: false, shouldFetch: false }),
  setLoading: (loading) => set({ loading }),
  setShouldFetch: () => set({ shouldFetch: true }),
}))
