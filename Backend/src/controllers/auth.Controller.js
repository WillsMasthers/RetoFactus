import { log } from 'console'
import { createAccessToken } from '../libs/jwt.js'
import User from '../models/user.model.js'
import { randomBytes, createHash } from 'crypto'

// Función para generar un salt aleatorio
export const generateSalt = () => {
  return randomBytes(16).toString('hex')
}

// Función para hashear contraseñas
export const hashPassword = (password, salt) => {
  const hash = createHash('sha256')
  hash.update(password + salt)
  return hash.digest('hex')
}

// Función para verificar contraseñas
const verifyPassword = (storedHash, password, salt) => {
  try {
    const hash = hashPassword(password, salt)
    return storedHash === hash
  } catch (error) {
    console.error('Error al verificar contraseña:', error)
    return false
  }
}

export async function register(req, res) {
  try {
    const { username, firstName, lastName, email, password } = req.body

    if (!username || !firstName || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, nombre y password son requeridos'
      })
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ username })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El nombre de usuario ya está en uso'
      })
    }

    const salt = generateSalt()
    const hashedPassword = hashPassword(password, salt)

    const newUser = new User({
      username,
      firstName,
      lastName: lastName || '',
      email,
      password: hashedPassword,
      salt,
      rol: 'user' // Rol por defecto
    })

    const userSaved = await newUser.save()
    const token = await createAccessToken({ id: userSaved._id })

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    })

    res.status(201).json({
      success: true,
      user: {
        id: userSaved._id,
        uuid: userSaved.uuid,
        username: userSaved.username,
        nombre: userSaved.nombre,
        email: userSaved.email,
        rol: userSaved.rol,
        rol_global: userSaved.rol_global
      }
    })
  } catch (error) {
    console.error('Error detallado en registro:', error)
    res.status(500).json({
      success: false,
      message: 'Error en el servidor al registrar el usuario'
    })
  }
}

export async function login(req, res) {
  try {
    const { username, password } = req.body
    console.log('Iniciando sesión:', { username, password })
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username y password son requeridos'
      })
    }

    const user = await User.findOne({ username })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Usuario no encontrado'
      })
    }

    const isValidPassword = verifyPassword(user.password, password, user.salt)

    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: 'Contraseña incorrecta'
      })
    }

    const token = await createAccessToken({
      id: user._id,
      username: user.username,
      rol: user.rol,
      rol_global: user.rol_global
    })

    // Establecer el token en el header Authorization
    res.setHeader('Authorization', `Bearer ${token}`)

    // Establecer la cookie 'token' para el frontend
    res.cookie('token', token, {
      httpOnly: false, // Permitir que el frontend acceda a la cookie
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    })

    // Incluir el token en la respuesta para que el frontend pueda usarlo
    res.json({
      success: true,
      message: 'Login exitoso',
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        rol: user.rol,
        rol_global: user.rol_global,
        token: token
      }
    })
  } catch (error) {
    console.error('Error en login:', error)
    res.status(500).json({
      success: false,
      message: 'Error en el login'
    })
  }
}

export async function logout(req, res) {
  try {
    res.cookie('token', '', {
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })
    return res.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    })
  } catch (error) {
    console.error('Error en logout:', error)
    res.status(500).json({
      success: false,
      message: 'Error al cerrar sesión'
    })
  }
}

// Endpoint para verificar si hay una sesión activa
export async function verifyAuth(req, res) {
  try {
    // Primero intentar obtener el token de la cookie
    let token = req.cookies.token

    // Si no hay token en la cookie, buscar en el header Authorization
    if (!token) {
      token = req.header('Authorization')
      if (token && token.startsWith('Bearer ')) {
        token = token.slice(7)
      }
    }

    if (!token) {
      console.log('No se encontró token en ninguna fuente')
      return res.status(401).json({
        success: false,
        message: 'No se encontró token'
      })
    }

    try {
      // Verificar el token directamente
      const verified = await createAccessToken.verify(token)

      // Verificar si el usuario existe
      const user = await User.findById(verified.id).select('+firstName +lastName +email +rol +rol_global')
      
      if (!user) {
        console.log('Usuario no encontrado en la verificación')
        return res.status(401).json({
          success: false,
          message: 'Usuario no encontrado'
        })
      }

      // Si todo está bien, devolver éxito
      console.log('Verificación exitosa para usuario:', user.username)
      return res.json({
        success: true,
        user: {
          id: user._id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          rol: user.rol,
          rol_global: user.rol_global
        }
      })
    } catch (error) {
      console.error('Error al verificar token:', error)
      return res.status(401).json({
        success: false,
        message: 'Token inválido o expirado'
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
