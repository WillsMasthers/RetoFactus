import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.100.11:4000/api'

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 segundos de timeout
})

// Interceptor para manejar el token en las peticiones
axiosInstance.interceptors.request.use(
  (config) => {
    // console.group('=== Inicio de petición ===')
    // console.log('URL:', config.url)
    // console.log('Método:', config.method)
    // console.log('Headers:', config.headers)
    // console.log('Datos:', config.data)

    // Buscar token en múltiples lugares
    let token = sessionStorage.getItem('authToken')
    if (!token) {
      token = localStorage.getItem('authToken')
      console.log('Token encontrado en localStorage')
    } else {
      console.log('Token encontrado en sessionStorage')
    }

    if (!token) {
      // Buscar en cookies
      const cookies = document.cookie.split('; ')
      const tokenCookie = cookies.find((cookie) =>
        cookie.startsWith('authToken=')
      )
      if (tokenCookie) {
        token = tokenCookie.split('=')[1]
        // console.log('Token encontrado en cookies')
      }
    }

    // Si encontramos un token, lo agregamos al header
    if (token) {
      try {
        // Asegurarse de que el token no tenga comillas
        const cleanToken = token.replace(/^"|"$/g, '')
        config.headers['Authorization'] = `Bearer ${cleanToken}`
        // console.log('Token agregado al header de la petición:', cleanToken)
      } catch (error) {
        console.error('Error al configurar el token:', error)
      }
    } else {
      console.warn('No se encontró token de autenticación')
    }

    // Asegurar que las cookies se envíen con la petición
    config.withCredentials = true
    // console.log('Configuración final de la petición:', config)
    // console.groupEnd()
    return config
  },
  (error) => {
    console.error('Error en el interceptor de request:', error)
    return Promise.reject(error)
  }
)

// Interceptor para manejar el token en las respuestas y errores
axiosInstance.interceptors.response.use(
  (response) => {
    // console.group('=== Respuesta exitosa ===')
    // console.log('URL:', response.config.url)
    // console.log('Status:', response.status)
    // console.log('Datos:', response.data)
    // console.log('Headers:', response.headers)
    // console.groupEnd()

    // Si hay un nuevo token en el header, guardarlo
    const token = response.headers['authorization']
    if (token && token.startsWith('Bearer ')) {
      const cleanToken = token.slice(7)
      console.log('Nuevo token recibido, guardando...')
      sessionStorage.setItem('authToken', cleanToken)
      localStorage.setItem('authToken', cleanToken)
      document.cookie = `authToken=${cleanToken}; path=/; max-age=${
        60 * 60 * 24 * 7
      }`
      axiosInstance.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${cleanToken}`
    }

    return response
  },
  (error) => {
    // console.group('=== Error en la petición ===')
    // console.log('URL:', error.config?.url)
    // console.log('Método:', error.config?.method)
    // console.log('Status:', error.response?.status)
    // console.log('Error:', error.message)
    // console.log('Respuesta:', error.response?.data)
    // console.groupEnd()

    if (error.code === 'ECONNABORTED') {
      console.log('Conexión abortada, intentando nuevamente...')
      return axiosInstance(error.config)
    }

    // Manejar errores de autenticación
    if (error.response?.status === 401) {
      console.log('Error 401 - No autorizado')
      // Limpiar token en todos los lugares
      sessionStorage.removeItem('authToken')
      localStorage.removeItem('authToken')
      document.cookie =
        'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      delete axiosInstance.defaults.headers.common['Authorization']

      // Redirigir a login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    // Lanzar el error para que se maneje en el componente
    return Promise.reject(error)
  }
)

export default axiosInstance
