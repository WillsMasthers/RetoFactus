import { Router } from 'express'
import { factusController } from '../controllers/factusController.js'
import { authRequired } from '../middlewares/validateToken.js'

const router = Router()

router.post('/invoice', authRequired, factusController.createInvoice)
router.get(
  '/invoice/:invoiceId',
  authRequired,
  factusController.getInvoiceStatus
)

export default router
