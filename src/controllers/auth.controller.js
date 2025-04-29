import { hashPassword, verifyPassword } from '../utils/passwordManager.js'
import { createAccessToken } from '../libs/jwt.js'
import User from '../models/user.model.js'

export async function register(req, res) {
  try {
    const { username, email, password } = req.body

    if (!username || !password || !email) {
      return res
        .status(400)
        .json({ message: 'Username, email y password son requeridos' })
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    })

    if (existingUser) {
      return res.status(400).json({
        message:
          existingUser.email === email
            ? 'El correo electrónico ya está registrado'
            : 'El nombre de usuario ya está en uso'
      })
    }

    const hashedPassword = await hashPassword(password)
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    })

    const userSaved = await newUser.save()
    const token = await createAccessToken({ id: userSaved._id })

    res.cookie('token', token)
    res.status(201).json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email
    })
  } catch (error) {
    console.error('Error detallado en registro:', error)
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'El usuario o correo electrónico ya existe'
      })
    }
    res.status(500).json({
      message: 'Error en el servidor al registrar el usuario'
    })
  }
}

export async function login(req, res) {
  try {
    const { emailOrUsername, password } = req.body

    const userFound = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    })

    if (!userFound) {
      return res.status(400).json({
        message: 'Usuario no encontrado'
      })
    }

    const isMatch = await verifyPassword(password, userFound.password)
    if (!isMatch) {
      return res.status(400).json({
        message: 'Contraseña incorrecta'
      })
    }

    const token = await createAccessToken({ id: userFound._id })

    res.cookie('token', token, {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'none'
    })

    res.status(200).json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email
    })
  } catch (error) {
    console.error('Error en login:', error)
    res.status(500).json({ error: 'Error en el login' })
  }
}

export async function logout(req, res) {
  try {
    res.cookie('token', '', { expires: new Date(0) })
    return res.sendStatus(200)
  } catch (error) {
    console.error('Error en logout:', error)
    res.status(500).json({ error: 'Error al cerrar sesión' })
  }
}
