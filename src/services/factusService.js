import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const FACTUS_API_URL = 'https://api.factus.com.co'
const FACTUS_API_KEY = process.env.FACTUS_API_KEY

const factusApi = axios.create({
  baseURL: FACTUS_API_URL,
  headers: {
    Authorization: `Bearer ${FACTUS_API_KEY}`,
    'Content-Type': 'application/json'
  }
})

export const factusService = {
  createInvoice: async (invoiceData) => {
    try {
      const response = await factusApi.post('/v2/invoice', invoiceData)
      return response.data
    } catch (error) {
      throw new Error(`Error creando factura: ${error.message}`)
    }
  },

  getInvoiceStatus: async (invoiceId) => {
    try {
      const response = await factusApi.get(`/v2/invoice/${invoiceId}`)
      return response.data
    } catch (error) {
      throw new Error(`Error consultando factura: ${error.message}`)
    }
  }
}
