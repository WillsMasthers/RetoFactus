// Importaciones de bibliotecas
import axios from 'axios'
import axiosInstance from '../config/axios'

// Tipos
export interface FactusInvoiceFilters {
  page?: number
  status?: number
  identification?: string
  names?: string
  number?: string
  prefix?: string
  reference_code?: string
}

export interface FactusInvoice {
  id: number
  number: string
  document: string
  customer: string
  identification: string
  total: number
  status: number
  created_at: string
  payment_form: string
}

export interface FactusInvoiceResponse {
  status: string
  message: string
  data: {
    data: FactusInvoice[]
    pagination: {
      total: number
      per_page: number
      current_page: number
      last_page: number
      from: number
      to: number
    }
  }
}

export const factusInvoicesService = {
  getFactusInvoices: async (
    filters: FactusInvoiceFilters
  ): Promise<FactusInvoiceResponse> => {
    console.log(
      '[Frontend Service] Iniciando solicitud de facturas con filtros:',
      filters
    )
    try {
      const response = await axiosInstance.get<FactusInvoiceResponse>(
        '/factus/invoice',
        {
          params: filters
        }
      )
      console.log('[Frontend Service] Respuesta recibida:', {
        totalFacturas: response.data?.data?.data?.length || 0,
        paginacion: response.data?.data?.pagination
      })
      return response.data
    } catch (error) {
      console.error('[Frontend Service] Error al obtener facturas:', error)
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 'Error al obtener facturas de Factus'
        )
      }
      throw error
    }
  },

  async getInvoiceDetails(invoiceNumber: string) {
    console.log(
      '[Frontend Service] Iniciando solicitud de detalles de factura:',
      invoiceNumber
    )
    try {
      const response = await axiosInstance.get(
        `/factus/invoice/${invoiceNumber}/view`
      )
      console.log('[Frontend Service] Detalles de factura recibidos:', {
        numero: invoiceNumber,
        tieneDatos: !!response.data?.data
      })
      return response.data
    } catch (error) {
      console.error(
        '[Frontend Service] Error al obtener detalles de factura:',
        {
          numero: invoiceNumber,
          error: error
        }
      )
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            'Error al obtener detalles de la factura'
        )
      }
      throw error
    }
  },

  async downloadInvoicePDF(invoiceNumber: string) {
    console.log(
      '[Frontend Service] Iniciando descarga de PDF de factura:',
      invoiceNumber
    )
    try {
      const response = await axiosInstance.get(
        `/factus/invoice/${invoiceNumber}/download-pdf`,
        {
          responseType: 'blob'
        }
      )
      console.log('[Frontend Service] PDF descargado:', {
        numero: invoiceNumber,
        tieneDatos: !!response.data
      })
      return response.data
    } catch (error) {
      console.error('[Frontend Service] Error al descargar PDF de factura:', {
        numero: invoiceNumber,
        error: error
      })
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            'Error al descargar el PDF de la factura'
        )
      }
      throw error
    }
  },

  async downloadInvoiceXML(invoiceNumber: string) {
    console.log(
      '[Frontend Service] Iniciando descarga de XML de factura:',
      invoiceNumber
    )
    try {
      const response = await axiosInstance.get(
        `/factus/invoice/${invoiceNumber}/download-xml`,
        {
          responseType: 'blob'
        }
      )
      console.log('[Frontend Service] XML descargado:', {
        numero: invoiceNumber,
        tieneDatos: !!response.data
      })
      return response.data
    } catch (error) {
      console.error('[Frontend Service] Error al descargar XML de factura:', {
        numero: invoiceNumber,
        error: error
      })
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            'Error al descargar el XML de la factura'
        )
      }
      throw error
    }
  }
}
