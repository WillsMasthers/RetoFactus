import { factusService } from '../services/factus.service.js'

export const factusController = {
  createInvoice: async (req, res) => {
    try {
      const invoiceData = req.body
      const result = await factusService.createInvoice(invoiceData)
      res.json(result)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },

  getInvoiceStatus: async (req, res) => {
    try {
      const { invoiceId } = req.params
      const result = await factusService.getInvoiceStatus(invoiceId)
      res.json(result)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },

  getFacturas: async (req, res) => {
    try {
      const result = await factusService.getFacturas()
      res.json(result)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },

  createFactura: async (req, res) => {
    try {
      const facturaData = req.body
      const { confirmar } = req.query

      if (!confirmar) {
        // Si no hay confirmación, devolver los datos para revisión
        return res.json({
          status: 'pending_confirmation',
          message: '¿Desea continuar con la iteración?',
          data: facturaData
        })
      }

      const result = await factusService.createFactura(facturaData)
      res.json(result)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}
