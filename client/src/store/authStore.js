import { create } from 'zustand'
import { registerRequest, loginRequest, logoutRequest } from '../api/auth.js'

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  errors: null,

  signup: async (user) => {
    try {
      const res = await registerRequest(user)
      set({ errors: null })
      return res
    } catch (error) {
      set({ errors: error.message })
      return null
    }
  },

  signin: async (user) => {
    try {
      const res = await loginRequest(user)
      set({ user: res, isAuthenticated: true, errors: null })
    } catch (error) {
      set({ errors: error.message })
    }
  },

  logout: async () => {
    try {
      await logoutRequest()
      set({ user: null, isAuthenticated: false, errors: null })
    } catch (error) {
      set({ errors: error.message })
    }
  },

  clearErrors: () => {
    set({ errors: null })
  }
}))
