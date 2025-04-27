import { factusService } from '../services/factusService.js'

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
  }
}
