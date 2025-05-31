/**
 * @file authStore.ts
 * @description Store de autenticación usando Zustand
 */

import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import axiosInstance from '../config/axios'

interface User {
  id: string
  username: string
  nombre: string
  email: string
  rol: string
  rol_global: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  isInitialized: boolean
  error: string | null
  lastAuthCheck: number
  token: string | null
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        // Estado inicial
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: false,
        error: null,
        lastAuthCheck: 0,
        token: null,

        // Iniciar sesión
        login: async (username: string, password: string) => {
          try {
            set({ isLoading: true, error: null })

            // Intentar obtener el token
            const response = await axiosInstance.post('/auth/login', {
              username: username.trim(),
              password: password.trim()
            })

            // Obtener el token del servidor
            let token: string | undefined

            // Primero buscar en el header Authorization
            if (response.headers['authorization']) {
              token = response.headers['authorization'].replace('Bearer ', '')
              console.log('Token encontrado en el header:', token)
            } else {
              // Si no está en el header, buscar en el body
              token = response.data.user?.token
            }

            if (!token) {
              throw new Error('No se recibió token del servidor')
            }

            // Guardar token
            sessionStorage.setItem('authToken', token)
            localStorage.setItem('authToken', token)
            document.cookie = `token=${encodeURIComponent(
              token
            )}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`

            // Configurar el token en axios
            axiosInstance.defaults.headers.common[
              'Authorization'
            ] = `Bearer ${token}`

            // Obtener la información completa del usuario
            const userResponse = await axiosInstance.get(
              `/users/${response.data.user.id}`
            )

            if (!userResponse.data.success) {
              throw new Error('No se pudieron obtener los datos del usuario')
            }

            const userData = userResponse.data.user

            // Actualizar estado
            set({
              user: {
                id: userData.id,
                username: userData.username,
                nombre: userData.nombre || '',
                email: userData.email,
                rol: userData.rol,
                rol_global: userData.rol_global
              },
              isAuthenticated: true,
              isLoading: false,
              lastAuthCheck: Date.now(),
              token: token
            })
          } catch (error) {
            console.error('Error al iniciar sesión:', error)
            set({
              error:
                error instanceof Error
                  ? error.message
                  : 'Error al iniciar sesión',
              isLoading: false
            })
            throw error
          }
        },

        // Cerrar sesión
        logout: async () => {
          try {
            set({ isLoading: true })

            // Limpiar tokens
            sessionStorage.removeItem('authToken')
            localStorage.removeItem('authToken')
            document.cookie =
              'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'

            // Limpiar encabezado de autorización
            delete axiosInstance.defaults.headers.common['Authorization']

            // Actualizar estado
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              token: null,
              lastAuthCheck: Date.now()
            })
          } catch (error) {
            console.error('Error al cerrar sesión:', error)
            set({
              error: 'Error al cerrar sesión',
              isLoading: false
            })
          }
        },

        // Verificar autenticación
        checkAuth: async () => {
          try {
            // Verificar si hay un token guardado
            const token = sessionStorage.getItem('authToken')
            // console.log('Token encontrado en checkAuth:', !!token);

            if (!token) {
              // console.log('No hay token, estableciendo estado no autenticado')
              set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                isInitialized: true,
                lastAuthCheck: Date.now(),
                token: null
              })
              return
            }

            // Configurar el token en axios
            axiosInstance.defaults.headers.common[
              'Authorization'
            ] = `Bearer ${token}`

            // Verificar la autenticación
            // console.log('Verificando autenticación con el servidor...');
            const verifyResponse = await axiosInstance.get('/auth/verify')
            // console.log('Respuesta de verificación de autenticación:', verifyResponse.data);

            if (verifyResponse.data.success) {
              // Usar los datos del usuario de la respuesta de verificación
              const userData = verifyResponse.data.user
              // console.log('Autenticación exitosa, datos del usuario:', userData)

              set({
                user: {
                  id: userData.id,
                  username: userData.username,
                  nombre: userData.nombre || '',
                  email: userData.email,
                  rol: userData.rol,
                  rol_global: userData.rol_global
                },
                isAuthenticated: true,
                isLoading: false,
                isInitialized: true,
                lastAuthCheck: Date.now(),
                token: token,
                error: null
              })
            } else {
              // Si hay un error, limpiar el token
              // console.log('La verificación del token falló, limpiando tokens...')
              sessionStorage.removeItem('authToken')
              localStorage.removeItem('authToken')
              document.cookie =
                'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
              delete axiosInstance.defaults.headers.common['Authorization']

              set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                isInitialized: true,
                error: 'Error de autenticación',
                lastAuthCheck: Date.now(),
                token: null
              })
            }
          } catch (error) {
            console.error('Error en checkAuth:', error)
            // Limpiar el estado en caso de error
            sessionStorage.removeItem('authToken')
            localStorage.removeItem('authToken')
            document.cookie =
              'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
            delete axiosInstance.defaults.headers.common['Authorization']

            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              isInitialized: true,
              error:
                error instanceof Error
                  ? error.message
                  : 'Error de autenticación',
              lastAuthCheck: Date.now(),
              token: null
            })
          }
        },

        // Limpiar mensajes de error
        clearError: () => {
          // console.log('Limpiando error')
          set({ error: null })
        }
      }),
      {
        name: 'auth-storage',
        // Configuración específica de qué datos persistir
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          token: state.token
        })
      }
    )
  )
)
