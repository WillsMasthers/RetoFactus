import { Router } from 'express'
import { login, logout, register } from '../controllers/auth.controller.js'
import { validateSchema } from '../middlewares/validator.middleware.js'
import { loginSchema, registerSchema } from '../schemas/auth.schema.js'
import { validateToken } from '../middlewares/validateToken.js'

const router = Router()

router.post('/register', validateSchema(registerSchema), register)
router.post('/login', validateSchema(loginSchema), login)
router.get('/verify', validateToken, (req, res) => res.json({ user: req.user }))
router.post('/logout', validateToken, logout)

export default router
