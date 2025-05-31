import axios from 'axios'

const FACTUS_API_URL =
  process.env.FACTUS_API_URL || 'https://api-sandbox.factus.com.co/v1'

export const factusService = {
  getInvoices: async (params: any) => {
    return axios.get(`${FACTUS_API_URL}/bills`, { params })
  },

  getInvoiceDetails: async (number: string) => {
    return axios.get(`${FACTUS_API_URL}/bills/${number}`)
  },

  downloadInvoicePDF: async (number: string) => {
    return axios.get(`${FACTUS_API_URL}/bills/download-pdf/${number}`, {
      responseType: 'arraybuffer'
    })
  }
}
