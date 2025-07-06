import { Router } from 'express'
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/category.controller.js'

const router = Router()

// Rutas de categorías
router.get('/', getCategories)
router.get('/:uuid', getCategory)
router.post('/', createCategory)
router.put('/:uuid', updateCategory)
router.delete('/:uuid', deleteCategory)

export default router
