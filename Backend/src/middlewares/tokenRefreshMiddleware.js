import { refreshFactusToken } from '../services/factusAuthService.js'

export const tokenRefreshMiddleware = async (req, res, next) => {
  try {
    // Asumiendo que guardamos el refresh token en la sesión o en el request
    const oldRefreshToken = req.session?.refreshToken

    if (oldRefreshToken) {
      const newTokens = await refreshFactusToken(oldRefreshToken)

      // Guardamos los nuevos tokens
      req.session.accessToken = newTokens.accessToken
      req.session.expiresIn = newTokens.expiresIn
    }

    next()
  } catch (error) {
    console.error('Error al refrescar el token:', error.message)
    res.status(401).json({ message: 'Error al refrescar el token' })
  }
}
