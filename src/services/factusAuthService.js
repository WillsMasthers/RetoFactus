import { factusAxiosInstance } from '../shared/http/axios-instance'
import {
  createTokenRequestData,
  createRefreshTokenRequestData
} from '../shared/utils/token.utils'
import { FACTUS_CONFIG } from '../shared/config/constants'
import dotenv from 'dotenv'

dotenv.config()

// Configuración de variables de entorno
const {
  FACTUS_USERNAME,
  FACTUS_PASSWORD,
  FACTUS_CLIENT_ID,
  FACTUS_CLIENT_SECRET,
  FACTUS_API_URL
} = process.env

/**
 * Obtiene el token de acceso usando las credenciales configuradas
 * @returns {Promise<Object>} Tokens de acceso y actualización
 */
export const getFactusToken = async () => {
  try {
    const data = createTokenRequestData({
      clientId: FACTUS_CLIENT_ID,
      clientSecret: FACTUS_CLIENT_SECRET,
      username: FACTUS_USERNAME,
      password: FACTUS_PASSWORD
    })

    const response = await factusAxiosInstance.post(
      FACTUS_CONFIG.ENDPOINTS.TOKEN,
      data
    )

    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in
    }
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Error al obtener token de Factus'
    )
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
