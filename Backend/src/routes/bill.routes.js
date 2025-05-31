import { Router } from 'express'
import {
  createBill,
  getBills,
  getBillById,
  updateBill,
  deleteBill
} from '../controllers/bill.controller.js'
import { validateToken } from '../middlewares/validateToken.js'

const router = Router()

// Todas las rutas requieren autenticación
router.use(validateToken)

// Rutas para facturas
router.post('/', createBill)
router.get('/', getBills)
router.get('/:id', getBillById)
router.put('/:id', updateBill)
router.delete('/:id', deleteBill)

export default router
