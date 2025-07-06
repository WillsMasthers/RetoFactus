import { Router } from 'express'
import {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand
} from '../controllers/brand.controller.js'

const router = Router()

// Rutas de marcas
router.get('/', getBrands)
router.get('/:uuid', getBrand)
router.post('/', createBrand)
router.put('/:uuid', updateBrand)
router.delete('/:uuid', deleteBrand)

export default router
