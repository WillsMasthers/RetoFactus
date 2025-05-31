/**
 * @file Login.tsx
 * @description Componente de login con formulario y manejo de autenticación
 */

import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Card, Title, TextInput, Button, Text } from '@tremor/react'
import { LogoTitle } from '../components/common/LogoTitle'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated, isLoading, error, clearError } = useAuthStore()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    // Verificar si ya está autenticado al cargar el componente
    if (isAuthenticated && !isLoading && !error) {
      // Esperar un momento para que el estado se actualice completamente
      setTimeout(() => {
        const from = (location.state as any)?.from || '/dashboard'
        navigate(from, { replace: true })
      }, 500)
    }
  }, [isAuthenticated, isLoading, error, navigate, location])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    try {
      await login(username, password)

      // Verificar si el login fue exitoso
      if (isAuthenticated) {
        // Esperar un momento para que el estado se actualice completamente
        await new Promise(resolve => setTimeout(resolve, 500))

        // Redirigir después de un login exitoso
        const from = (location.state as any)?.from || '/dashboard'
        navigate(from, { replace: true })

        // Limpiar los campos después del login exitoso
        setUsername('')
        setPassword('')
      }
    } catch (error) {
      console.error('Error en handleSubmit:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <LogoTitle />
        </div>

        <Card className="p-8 shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl">
          <Title className="text-center text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Iniciar Sesión
          </Title>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Usuario
                </label>
                <TextInput
                  id="username"
                  type="text"
                  required
                  placeholder="Ingrese su usuario"
                  value={username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                  disabled={isLoading}
                  className="w-full transition-all duration-200 focus:ring-2 dark:text-white focus:ring-blue-500 rounded-xl border-gray-200 dark:border-gray-700 px-4 py-1"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contraseña
                </label>
                <TextInput
                  id="password"
                  type="password"
                  required
                  placeholder="Ingrese su contraseña"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full transition-all duration-200 focus:ring-2 dark:text-white focus:ring-blue-500 rounded-xl border-gray-200 dark:border-gray-700 px-4 py-1"
                />
              </div>
            </div>

            {error && (
              <Text className="text-red-500 text-center">
                {error}
              </Text>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white inline-block mr-2"></div>
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
            <a href="/" className='w-full'>
              <span className=' dark:text-slate-400 hover:text-blue-600 hover:underline'>
                Regresar al Inicio
              </span>
            </a>
          </form>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ¿Necesitas ayuda?{' '}
            <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
              Contacta al administrador
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
