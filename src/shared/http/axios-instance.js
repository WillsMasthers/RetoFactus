import axios from 'axios'
import { FACTUS_CONFIG } from '../config/constants.js'

export const factusAxiosInstance = axios.create({
  baseURL: FACTUS_CONFIG.API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

// Interceptor para manejar errores
factusAxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en petición:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)
