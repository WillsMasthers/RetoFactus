import { Router } from 'express'
import {
  login,
  logout,
  register,
  verifyAuth
} from '../controllers/auth.controller.js'
import { validateSchema } from '../middlewares/validator.middleware.js'
import { loginSchema, registerSchema } from '../schemas/auth.schema.js'
import { validateToken } from '../middlewares/validateToken.js'
import { checkAuth } from '../middlewares/checkAuth.js'

const router = Router()

// Rutas públicas
router.post('/register', validateSchema(registerSchema), register)
router.post('/login', validateSchema(loginSchema), login)

// Rutas protegidas
router.get('/verify', checkAuth)
router.post('/logout', validateToken, logout)

export default router
