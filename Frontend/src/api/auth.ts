/**
 * @file auth.ts
 * @description Servicios de autenticación para la aplicación
 */

const API = 'http://localhost:4000/api'

/**
 * Realiza la petición de login al backend
 * @param credentials - Credenciales del usuario
 * @returns Promise con la respuesta del servidor
 */
export const loginRequest = async (credentials: {
  emailOrUsername: string
  password: string
}) => {
  try {
    const response = await fetch(`${API}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(credentials)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Error al iniciar sesión')
    }

    return response.json()
  } catch (error) {
    console.error('Error en login:', error)
    throw error
  }
}

/**
 * Realiza la petición de logout al backend
 * @returns Promise con la respuesta del servidor
 */
export const logoutRequest = async () => {
  try {
    const response = await fetch(`${API}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Error al cerrar sesión')
    }

    return response.json()
  } catch (error) {
    console.error('Error en logout:', error)
    throw error
  }
}

/**
 * Verifica si el usuario está autenticado
 * @returns Promise con la respuesta del servidor
 */
export const verifyAuthRequest = async () => {
  try {
    const response = await fetch(`${API}/verify`, {
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('No autenticado')
    }

    return response.json()
  } catch (error) {
    console.error('Error en verificación:', error)
    throw error
  }
}
