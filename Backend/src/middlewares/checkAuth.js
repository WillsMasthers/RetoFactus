import jwt from 'jsonwebtoken'
import { TOKEN_SECRET } from '../config.js'

export const checkAuth = async (req, res, next) => {
  try {
    // Obtener el token del header Authorization
    let token = req.header('Authorization')

    // Si el token está en el header, eliminar 'Bearer '
    if (token && token.startsWith('Bearer ')) {
      token = token.slice(7)
    }

    // Si no hay token en el header, intentar obtenerlo de la cookie
    if (!token) {
      token = req.cookies?.token
    }

    // Si no hay token en la cookie, intentar obtenerlo del body
    if (!token) {
      token = req.body?.token
    }

    if (!token) {
      return res.json({
        success: false,
        message: 'No hay sesión activa'
      })
    }

    try {
      // Verificar el token directamente
      const verified = jwt.verify(token, TOKEN_SECRET)

      // Guardar el token y el usuario verificado en el request
      req.user = verified
      return res.json({
        success: true,
        user: {
          id: verified.id,
          username: verified.username,
          rol: verified.rol,
          rol_global: verified.rol_global
        }
      })
    } catch (error) {
      console.error('Error al verificar token:', error)
      return res.json({
        success: false,
        message: 'Sesión expirada'
      })
    }
  } catch (error) {
    console.error('Error en verificación de autenticación:', error)
    return res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    })
  }
}
