import jwt from 'jsonwebtoken'
import { TOKEN_SECRET } from '../config.js'

export const validateToken = (req, res, next) => {
  const token = req.header('Authorization')

  if (!token) {
    return res.status(401).json({
      message: 'Acceso denegado. Token no proporcionado'
    })
  }

  try {
    // Eliminar 'Bearer ' del token si existe
    const tokenString = token.startsWith('Bearer ') ? token.slice(7) : token
    const verified = jwt.verify(tokenString, TOKEN_SECRET)
    req.user = verified
    next()
  } catch (error) {
    res.status(401).json({
      message: 'Token inválido o expirado'
    })
  }
}
