import { factusAxiosInstance } from '../shared/http/axios-instance.js'
import { FACTUS_CONFIG } from '../shared/config/constants.js'
import { buildFacturasFilters } from '../shared/utils/factusFilters.js'

export const factusService = {
  createInvoice: async (invoiceData) => {
    // console.log('[Factus Service] Iniciando creación de factura')
    try {
      const response = await factusAxiosInstance.post(
        FACTUS_CONFIG.ENDPOINTS.INVOICE,
        invoiceData
      )
      // console.log('[Factus Service] Factura creada exitosamente', {
      //   id: response.data?.id,
      //   status: response.data?.status
      // })
      return response.data
    } catch (error) {
      console.error('[Factus Service] Error al crear factura:', {
        mensaje: error.message,
        detalles: error.response?.data
      })
      throw new Error(`Error creando factura: ${error.message}`)
    }
  },

  getInvoiceStatus: async (invoiceId) => {
    // console.log('[Factus Service] Consultando estado de factura:', invoiceId)
    try {
      const response = await factusAxiosInstance.get(
        `${FACTUS_CONFIG.ENDPOINTS.INVOICE}/${invoiceId}`
      )
      // console.log('[Factus Service] Estado de factura obtenido:', {
      //   id: invoiceId,
      //   status: response.data?.status
      // })
      return response.data
    } catch (error) {
      console.error('[Factus Service] Error al consultar estado de factura:', {
        id: invoiceId,
        mensaje: error.message,
        detalles: error.response?.data
      })
      throw new Error(`Error consultando factura: ${error.message}`)
    }
  },

  getInvoice: async (invoiceNumber, accessToken = null) => {
    // console.log('[Factus Service] Consultando factura:', invoiceNumber)
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json'
        }
      }
      const response = await factusAxiosInstance.get(
        `/v1/bills/show/${invoiceNumber}`,
        config
      )
      // console.log('[Factus Service] Factura obtenida exitosamente:', {
      //   number: invoiceNumber,
      //   status: response.data?.status
      // })
      return response.data
    } catch (error) {
      console.error('[Factus Service] Error al obtener factura:', {
        number: invoiceNumber,
        status: error.response?.status,
        mensaje: error.message,
        detalles: error.response?.data
      })
      throw {
        status: error.response?.status,
        headers: error.response?.headers,
        data: error.response?.data,
        config: error.config,
        message: error.response?.data?.message || error.message
      }
    }
  },

  getFacturas: async (filters = {}, accessToken = null) => {
    // console.log('[Factus Service] Consultando lista de facturas')
    // console.log('[Factus Service] Filtros recibidos:', filters)
    try {
      if (!filters.status) {
        filters.status = 'all'
      }
      const params = buildFacturasFilters(filters)
      // console.log('[Factus Service] Parámetros construidos:', params)

      const config = { params }
      if (accessToken) {
        config.headers = {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }
      // console.log('[Factus Service] Configuración de la petición:', {
      //   url: '/v1/bills',
      //   tieneToken: !!accessToken,
      //   params: config.params
      // })

      const response = await factusAxiosInstance.get('/v1/bills', config)
      // console.log('[Factus Service] Respuesta recibida:', {
      //   totalRegistros: response.data?.data?.length || 0,
      //   paginacion: response.data?.pagination
      // })
      return response.data
    } catch (error) {
      console.error('[Factus Service] Error al obtener facturas:', {
        mensaje: error.message,
        detalles: error.response?.data,
        configuracion: {
          filtros: filters,
          tieneToken: !!accessToken
        }
      })
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
  },

  downloadInvoicePDF: async (invoiceNumber, accessToken = null) => {
    console.log('[Factus Service] Iniciando descarga de PDF:', invoiceNumber)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json'
        }
      }

      const response = await factusAxiosInstance.get(
        `/v1/bills/download-pdf/${invoiceNumber}`,
        config
      )

      console.log('[Factus Service] Respuesta de Factus:', {
        status: response.status,
        headers: response.headers,
        contentType: response.headers['content-type'],
        tieneData: !!response.data,
        tienePDF: !!response.data?.data?.pdf_base_64_encoded,
        responseData: response.data
      })

      // Verificar si la respuesta es un PDF directo
      if (response.headers['content-type']?.includes('application/pdf')) {
        return {
          status: 200,
          headers: {
            'content-type': 'application/pdf'
          },
          data: response.data
        }
      }

      // Si no es PDF directo, esperamos base64
      if (!response.data?.data?.pdf_base_64_encoded) {
        throw new Error('No se encontró el PDF en la respuesta')
      }

      // Convertir el base64 a buffer
      const pdfBuffer = Buffer.from(
        response.data.data.pdf_base_64_encoded,
        'base64'
      )

      // Verificar si es un PDF válido
      const isPDF = pdfBuffer.slice(0, 5).toString() === '%PDF-'
      if (!isPDF) {
        console.error(
          '[Factus Service] La respuesta no parece ser un PDF válido'
        )
        throw new Error('La respuesta no es un PDF válido')
      }

      // Crear una respuesta similar a la que espera el controlador
      return {
        status: 200,
        headers: {
          'content-type': 'application/pdf'
        },
        data: pdfBuffer
      }
    } catch (error) {
      console.error('[Factus Service] Error al descargar PDF:', {
        number: invoiceNumber,
        status: error.response?.status,
        mensaje: error.message,
        detalles: error.response?.data,
        headers: error.response?.headers
      })
      throw {
        status: error.response?.status,
        headers: error.response?.headers,
        data: error.response?.data,
        config: error.config,
        message: error.response?.data?.message || error.message
      }
    }
  },

  downloadInvoiceXML: async (invoiceNumber, accessToken = null) => {
    console.log('[Factus Service] Iniciando descarga de XML:', invoiceNumber)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json'
        }
      }

      const response = await factusAxiosInstance.get(
        `/v1/bills/download-xml/${invoiceNumber}`,
        config
      )

      console.log('[Factus Service] Respuesta de Factus:', {
        status: response.status,
        headers: response.headers,
        contentType: response.headers['content-type'],
        tieneData: !!response.data,
        tieneXML: !!response.data?.data?.xml_base_64_encoded,
        responseData: response.data
      })

      // Verificar si la respuesta es un XML directo
      if (response.headers['content-type']?.includes('application/xml')) {
        return {
          status: 200,
          headers: {
            'content-type': 'application/xml'
          },
          data: response.data
        }
      }

      // Si no es XML directo, esperamos base64
      if (!response.data?.data?.xml_base_64_encoded) {
        throw new Error('No se encontró el XML en la respuesta')
      }

      // Convertir el base64 a buffer
      const xmlBuffer = Buffer.from(
        response.data.data.xml_base_64_encoded,
        'base64'
      )

      // Verificar si es un XML válido
      const isXML = xmlBuffer.slice(0, 5).toString().includes('<?xml')
      if (!isXML) {
        console.error(
          '[Factus Service] La respuesta no parece ser un XML válido'
        )
        throw new Error('La respuesta no es un XML válido')
      }

      // Crear una respuesta similar a la que espera el controlador
      return {
        status: 200,
        headers: {
          'content-type': 'application/xml'
        },
        data: xmlBuffer
      }
    } catch (error) {
      console.error('[Factus Service] Error al descargar XML:', {
        number: invoiceNumber,
        status: error.response?.status,
        mensaje: error.message,
        detalles: error.response?.data,
        headers: error.response?.headers
      })
      throw {
        status: error.response?.status,
        headers: error.response?.headers,
        data: error.response?.data,
        config: error.config,
        message: error.response?.data?.message || error.message
      }
    }
  }
}
