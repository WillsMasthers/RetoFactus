import { useState, createContext, useContext } from 'react'
import { registerRequest, loginRequest } from '../api/auth.js'

export const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [errors, setErrors] = useState(null)

  const signup = async (user) => {
    try {
      const res = await registerRequest(user)
      setUser(res)
      setIsAuthenticated(true)
    } catch (error) {
      setErrors(error.message)
    }
  }

  const signin = async (user) => {
    try {
      const res = await loginRequest(user)
      setUser(res)
      setIsAuthenticated(true)
    } catch (error) {
      setErrors(error.message)
    }
  }

  return (
    <AuthContext.Provider
      value={{ signup, signin, user, isAuthenticated, errors }}
    >
      {children}
    </AuthContext.Provider>
  )
}
