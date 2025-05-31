/**
 * @file ProtectedRoute.tsx
 * @description Componente para proteger rutas que requieren autenticación
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useEffect } from 'react'

export function ProtectedRoute() {
  const { isAuthenticated, checkAuth, isLoading, isInitialized } = useAuthStore()
  const location = useLocation()

  useEffect(() => {
    // console.log('ProtectedRoute - Efecto ejecutado', { isAuthenticated, isLoading, isInitialized })

    // Verificar autenticación si no está inicializado o no está autenticado
    if (!isInitialized || !isAuthenticated) {
      // console.log('ProtectedRoute - Verificando autenticación...')
      checkAuth().catch(error => {
        console.error('Error al verificar autenticación:', error)
      })
    }
  }, [checkAuth, isAuthenticated, isLoading, isInitialized])

  // console.log('ProtectedRoute - Renderizando', { isAuthenticated, isLoading, isInitialized });

  // Mostrar loading durante la verificación inicial o mientras se carga
  if (isLoading || !isInitialized) {
    // console.log('ProtectedRoute - Mostrando loader')
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Guardamos la URL actual para redirigir después del login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return <Outlet />
}