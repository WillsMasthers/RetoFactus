import { getFactusToken } from '../services/factus.auth.service.js'
import { FACTUS_CONFIG } from '../shared/config/constants.js'

export const validateFactusToken = async (req, res, next) => {
  // console.log('[Factus Middleware] Iniciando validación de token')
  try {
    const now = Date.now()
    const factusCurrentToken = req.cookies.factusToken
    const factusTokenExpiration = req.cookies.factusExpiration

    // console.log('[Factus Middleware] Estado actual:', {
    //   tieneToken: !!factusCurrentToken,
    //   tieneExpiracion: !!factusTokenExpiration,
    //   tiempoRestante: factusTokenExpiration
    //     ? parseInt(factusTokenExpiration) - now
    //     : 'N/A'
    // })

    // Renovar token si no existe o está próximo a expirar (1 minuto antes)
    if (
      !factusCurrentToken ||
      !factusTokenExpiration ||
      now >= parseInt(factusTokenExpiration) - 60000
    ) {
      // console.log('[Factus Middleware] Renovando token...')
      const tokenData = await getFactusToken()
      // console.log('[Factus Middleware] Token renovado exitosamente', {
      //   expiraEn: tokenData.expiresIn
      // })

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

      // console.log('[Factus Middleware] Cookies actualizadas')
      req.factusToken = tokenData.accessToken
    } else {
      // console.log('[Factus Middleware] Usando token existente')
      req.factusToken = factusCurrentToken
    }

    // console.log('[Factus Middleware] Validación completada exitosamente')
    next()
  } catch (error) {
    console.error('[Factus Middleware] Error de validación:', {
      mensaje: error.message,
      detalles: error.response?.data,
      stack: error.stack
    })
    res.status(401).json({
      error: 'Error de autenticación con Factus'
    })
  }
}
