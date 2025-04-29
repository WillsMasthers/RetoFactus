import { factusAxiosInstance } from '../shared/http/axios-instance.js'
import {
  createTokenRequestData,
  createRefreshTokenRequestData
} from '../shared/utils/token.utils.js'
import { FACTUS_CONFIG } from '../shared/config/constants.js'
import dotenv from 'dotenv'
import axios from 'axios'

dotenv.config()

// Configuración de variables de entorno
const {
  FACTUS_USERNAME,
  FACTUS_PASSWORD,
  FACTUS_CLIENT_ID,
  FACTUS_CLIENT_SECRET,
  FACTUS_API_URL
} = process.env

const authClient = axios.create({
  baseURL: FACTUS_CONFIG.API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * Obtiene el token de acceso usando las credenciales configuradas
 * @returns {Promise<Object>} Tokens de acceso y actualización
 */
export const getFactusToken = async () => {
  try {
    const response = await authClient.post('/oauth/token', {
      grant_type: 'password',
      username: FACTUS_CONFIG.USERNAME,
      password: FACTUS_CONFIG.PASSWORD,
      client_id: FACTUS_CONFIG.CLIENT_ID,
      client_secret: FACTUS_CONFIG.CLIENT_SECRET
    })

    return {
      accessToken: response.data.access_token,
      expiresIn: response.data.expires_in,
      tokenType: response.data.token_type
    }
  } catch (error) {
    console.error(
      '[Factus] Error de autenticación:',
      error.response?.data || error.message
    )
    throw new Error('Error en autenticación Factus')
  }
}

/**
 * Obtiene un nuevo token usando el refresh token
 * @param {string} refreshToken - Token de actualización
 * @returns {Promise<Object>} Nuevo token de acceso y tiempo de expiración
 */
export const refreshFactusToken = async (refreshToken) => {
  try {
    // Preparación de datos en formato x-www-form-urlencoded
    const data = qs.stringify({
      grant_type: 'refresh_token',
      client_id: FACTUS_CLIENT_ID,
      client_secret: FACTUS_CLIENT_SECRET,
      refresh_token: refreshToken
    })

    // Configuración de la solicitud
    const response = await axios.post(`${FACTUS_API_URL}/oauth/token`, data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json'
      }
    })

    // Verificar y retornar los tokens
    const { access_token, expires_in } = response.data
    if (!access_token) {
      throw new Error('No se pudo obtener el access_token')
    }

    return {
      accessToken: access_token,
      expiresIn: expires_in
    }
  } catch (error) {
    console.error(
      'Error al refrescar el token:',
      error.response?.data || error.message
    )
    throw new Error(
      error.response?.data?.message || 'Error al refrescar el token de Factus'
    )
  }
}
