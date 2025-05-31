import { Router } from 'express'
import { getUserById } from '../controllers/user.Controller.js'
import { validateToken } from '../middlewares/validateToken.js'

const router = Router()

// Obtener información de un usuario por ID
router.get('/:id', validateToken, getUserById)

export default router
