import { Router } from 'express'
import { factusController } from '../controllers/factus.Controller.js'
import { validateToken } from '../middlewares/validateToken.js'
import { validateFactusToken } from '../middlewares/factus.validate.middleware.js'

const router = Router()

// Rutas existentes
router.post('/invoice', validateToken, factusController.createInvoice)
router.get(
  '/invoice/:invoiceId',
  validateToken,
  factusController.getInvoiceStatus
)

// Ruta para ver PDF de factura
router.get(
  '/invoice/:invoiceId/pdf',
  validateToken,
  factusController.viewInvoicePDF
)

// Estas rutas usan validateFactusToken para la API de Factus
router.get('/invoice', validateFactusToken, factusController.getFacturas)
router.post('/invoice', validateFactusToken, factusController.createFactura)

// Ruta para ver detalles de factura
router.get(
  '/invoice/:invoiceNumber/view',
  validateToken,
  validateFactusToken,
  factusController.getInvoice
)

// Ruta para descargar PDF de factura
router.get(
  '/invoice/:invoiceNumber/download-pdf',
  validateToken,
  validateFactusToken,
  factusController.downloadInvoicePDF
)

// Ruta para descargar XML de factura
router.get(
  '/invoice/:invoiceNumber/download-xml',
  validateToken,
  validateFactusToken,
  factusController.downloadInvoiceXML
)

export default router
