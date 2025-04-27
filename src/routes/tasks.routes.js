import { Router } from 'express'
import { authRequiered } from '../middlewares/validatedToken.js'
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

router.get('/tasks', authRequiered, getTasks)
router.get('/tasks/:id', authRequiered, getTask)
router.post(
  '/tasks',
  authRequiered,
  validateSchema(createTaskSchema),
  createTasks
)
router.delete('/tasks/:id', authRequiered, deleteTasks)
router.put('/tasks', authRequiered, updateTasks)

export default router
