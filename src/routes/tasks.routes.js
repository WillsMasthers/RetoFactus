import { Router } from 'express'
import { validateToken } from '../middlewares/validateToken.js' // Token JWT interno
import {
  createTasks,
  deleteTasks,
  getTask,
  getTasks,
  updateTasks
} from '../controllers/task.controller.js'
import { validateSchema } from '../middlewares/validator.middleware.js'
import { createTaskSchema } from '../schemas/task.schema.js'

const router = Router()

// Estas rutas usan authRequired para el token JWT interno
router.get('/tasks', validateToken, getTasks)
router.get('/tasks/:id', validateToken, getTask)
router.post(
  '/tasks',
  validateToken,
  validateSchema(createTaskSchema),
  createTasks
)
router.delete('/tasks/:id', validateToken, deleteTasks)
router.put('/tasks', validateToken, updateTasks)

export default router
