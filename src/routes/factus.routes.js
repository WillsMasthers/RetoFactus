import { Router } from 'express'
import { factusController } from '../controllers/factus.Controller.js'
import { validateToken } from '../middlewares/validateToken.js'
import { validateFactusToken } from '../middlewares/factus.validate.middleware.js'

const router = Router()

router.post('/invoice', validateToken, factusController.createInvoice)
router.get(
  '/invoice/:invoiceId',
  validateToken,
  factusController.getInvoiceStatus
)

// Estas rutas usan validateFactusToken para la API de Factus
router.get('/facturas', validateFactusToken, factusController.getFacturas)
router.post('/facturas', validateFactusToken, factusController.createFactura)

export default router
