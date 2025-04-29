import { getFactusToken } from '../services/factus.auth.service.js'
import { FACTUS_CONFIG } from '../shared/config/constants.js'

export const validateFactusToken = async (req, res, next) => {
  try {
    const now = Date.now()
    const factusCurrentToken = req.cookies.factusToken
    const factusTokenExpiration = req.cookies.factusExpiration

    // Renovar token si no existe o está próximo a expirar (1 minuto antes)
    if (
      !factusCurrentToken ||
      !factusTokenExpiration ||
      now >= parseInt(factusTokenExpiration) - 60000
    ) {
      const tokenData = await getFactusToken()

      // Guardar token en cookie segura
      res.cookie('factusToken', tokenData.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: tokenData.expiresIn * 1000
      })

      // Guardar tiempo de expiración
      res.cookie('factusExpiration', now + tokenData.expiresIn * 1000, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: tokenData.expiresIn * 1000
      })

      req.factusToken = tokenData.accessToken
    } else {
      req.factusToken = factusCurrentToken
    }

    next()
  } catch (error) {
    console.error('[Factus] Error de validación:', error)
    res.status(401).json({
      error: 'Error de autenticación con Factus'
    })
  }
}
