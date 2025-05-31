import { useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'

interface LoginCredentials {
  emailOrUsername: string
  password: string
}

export const useAuth = () => {
  // Obtener el estado y las acciones del store
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    login, 
    logout, 
    checkAuth,
    clearError
  } = useAuthStore()
  
  const navigate = useNavigate()

  // Inicializar la autenticación al cargar el hook
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      await login(credentials.username, credentials.password)
    },
    onSuccess: () => {
      navigate('/dashboard')
    }
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await logout()
    },
    onSuccess: () => {
      navigate('/login')
    }
  })

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || loginMutation.isPending || logoutMutation.isPending,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    error: loginMutation.error || logoutMutation.error,
    clearError
  }
}
