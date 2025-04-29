import { factusAxiosInstance } from '../shared/http/axios-instance.js'
import { FACTUS_CONFIG } from '../shared/config/constants.js'

export const factusService = {
  createInvoice: async (invoiceData) => {
    try {
      const response = await factusAxiosInstance.post(
        FACTUS_CONFIG.ENDPOINTS.INVOICE,
        invoiceData
      )
      return response.data
    } catch (error) {
      throw new Error(`Error creando factura: ${error.message}`)
    }
  },

  getInvoiceStatus: async (invoiceId) => {
    try {
      const response = await factusAxiosInstance.get(
        `${FACTUS_CONFIG.ENDPOINTS.INVOICE}/${invoiceId}`
      )
      return response.data
    } catch (error) {
      throw new Error(`Error consultando factura: ${error.message}`)
    }
  },

  getFacturas: async () => {
    try {
      const response = await factusAxiosInstance.get(
        FACTUS_CONFIG.ENDPOINTS.FACTURAS
      )
      return response.data
    } catch (error) {
      throw new Error(`Error obteniendo facturas: ${error.message}`)
    }
  },

  createFactura: async (facturaData) => {
    try {
      const response = await factusAxiosInstance.post(
        FACTUS_CONFIG.ENDPOINTS.FACTURAS,
        facturaData
      )
      return response.data
    } catch (error) {
      throw new Error(`Error creando factura: ${error.message}`)
    }
  }
}
