import { Router } from 'express'
import {
  getFactusInvoices,
  getInvoiceDetails,
  downloadInvoicePDF
} from '../controllers/bills'

const router = Router()

// Rutas de facturas
router.get('/factus/invoice', getFactusInvoices)
router.get('/factus/invoice/:number/view', getInvoiceDetails)
router.get('/factus/invoice/:number/download-pdf', downloadInvoicePDF)

export default router
