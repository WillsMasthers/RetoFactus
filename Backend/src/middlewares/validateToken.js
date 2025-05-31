import jwt from 'jsonwebtoken'
import { TOKEN_SECRET } from '../config.js'

export const validateToken = (req, res, next) => {
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
    console.log('No se encontró token en ninguna fuente')
    return res.status(401).json({
      success: false,
      message: 'Acceso denegado. Token no proporcionado'
    })
  }

  try {
    // Verificar el token directamente
    const verified = jwt.verify(token, TOKEN_SECRET)

    // Guardar el token y el usuario verificado en el request
    req.user = verified
    next()
  } catch (error) {
    console.error('Error al verificar token:', error)
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado'
    })
  }
}
