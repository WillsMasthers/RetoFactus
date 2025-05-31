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
    console.log('[Backend Controller] Iniciando solicitud de facturas')
    console.log('[Backend Controller] Filtros recibidos:', req.query)
    try {
      // Tomar los filtros del query string
      const filters = { ...req.query }
      console.log('[Backend Controller] Filtros procesados:', filters)

      // Pasar el token obtenido por el middleware al servicio
      console.log('[Backend Controller] Token disponible:', !!req.factusToken)
      const result = await factusService.getFacturas(filters, req.factusToken)

      console.log('[Backend Controller] Datos recibidos del servicio:', {
        totalRegistros: result?.data?.data?.length || 0,
        paginacion: result?.data?.pagination
      })

      const facturas = (result?.data?.data || []).map((f) => ({
        id: f.id,
        number: f.number,
        document: f.document?.name || '',
        customer: f.names || f.graphic_representation_name || '',
        identification: f.identification,
        total: f.total,
        status: f.status,
        created_at: f.created_at,
        payment_form: f.payment_form?.name || ''
      }))

      console.log('[Backend Controller] Respuesta preparada:', {
        totalFacturas: facturas.length,
        paginacion: result?.data?.pagination
      })

      res.json({
        status: 'OK',
        data: {
          data: facturas,
          pagination: result?.data?.pagination
        }
      })
    } catch (error) {
      console.error('[Backend Controller] Error al obtener facturas:', {
        mensaje: error.message,
        detalles: error.response?.data
      })
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
  },

  viewInvoicePDF: async (req, res) => {
    try {
      const { invoiceId } = req.params

      // Construir la URL para ver la factura en Factus
      const factusUrl = `${FACTUS_CONFIG.API_URL}/facturas/ver/${invoiceId}`

      // Hacer la petición a Factus con el token
      const response = await factusAxiosInstance.get(factusUrl, {
        headers: {
          Authorization: `Bearer ${req.factusToken}`
        }
      })

      // Devolver la respuesta de Factus
      res.json({
        status: 'OK',
        data: response.data
      })
    } catch (error) {
      res.status(500).json({
        message: `Error al ver la factura: ${error.message}`
      })
    }
  },

  getInvoice: async (req, res) => {
    console.log(
      '[Backend Controller] Iniciando solicitud de detalles de factura'
    )
    console.log(
      '[Backend Controller] Número de factura:',
      req.params.invoiceNumber
    )
    try {
      const { invoiceNumber } = req.params
      const token = req.factusToken

      console.log('[Backend Controller] Token disponible:', !!token)
      console.log('[Backend Controller] Enviando petición a Factus...')

      const response = await factusService.getInvoice(invoiceNumber, token)

      console.log('[Backend Controller] Respuesta recibida de Factus:', {
        numero: invoiceNumber,
        tieneDatos: !!response,
        status: response?.status
      })

      res.json({
        status: 'OK',
        data: response
      })
    } catch (error) {
      console.error('[Backend Controller] Error en petición:', {
        numero: req.params.invoiceNumber,
        status: error.status,
        mensaje: error.message,
        detalles: error.data
      })

      res.status(error.status || 500).json({
        message: error.message,
        error: error.data
      })
    }
  },

  // Descargar PDF de factura
  downloadInvoicePDF: async (req, res) => {
    try {
      const { invoiceNumber } = req.params
      const token = req.factusToken

      console.log('[Backend Controller] Iniciando descarga de PDF:', {
        numero: invoiceNumber,
        tieneToken: !!token
      })

      const response = await factusService.downloadInvoicePDF(
        invoiceNumber,
        token
      )

      // Verificar la respuesta antes de enviarla
      console.log('[Backend Controller] Respuesta del servicio:', {
        status: response.status,
        headers: response.headers,
        contentType: response.headers['content-type'],
        contentLength: response.data?.length,
        isBuffer: Buffer.isBuffer(response.data),
        primerosBytes: response.data?.slice(0, 5)?.toString('hex')
      })

      // Verificar si es un PDF válido
      const isPDF = response.data?.slice(0, 5)?.toString() === '%PDF-'
      if (!isPDF) {
        console.error('[Backend Controller] La respuesta no es un PDF válido')
        return res.status(400).json({
          error: 'La respuesta no es un PDF válido'
        })
      }

      // Configurar headers para la descarga
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=factura-${invoiceNumber}.pdf`
      )
      res.setHeader('X-Content-Type-Options', 'nosniff')
      res.setHeader('X-Frame-Options', 'DENY')
      res.setHeader('X-XSS-Protection', '1; mode=block')

      // Enviar el PDF
      res.send(response.data)
    } catch (error) {
      console.error('[Backend Controller] Error al descargar PDF:', error)
      res.status(error.status || 500).json({
        error: error.message || 'Error al descargar el PDF de la factura'
      })
    }
  },

  // Descargar XML de factura
  downloadInvoiceXML: async (req, res) => {
    try {
      const { invoiceNumber } = req.params
      const token = req.factusToken

      console.log('[Backend Controller] Iniciando descarga de XML:', {
        numero: invoiceNumber,
        tieneToken: !!token
      })

      const response = await factusService.downloadInvoiceXML(
        invoiceNumber,
        token
      )

      // Verificar la respuesta antes de enviarla
      console.log('[Backend Controller] Respuesta del servicio:', {
        status: response.status,
        headers: response.headers,
        contentType: response.headers['content-type'],
        contentLength: response.data?.length,
        isBuffer: Buffer.isBuffer(response.data),
        primerosBytes: response.data?.slice(0, 5)?.toString('hex')
      })

      // Verificar si es un XML válido
      const isXML = response.data?.slice(0, 5)?.toString().includes('<?xml')
      if (!isXML) {
        console.error('[Backend Controller] La respuesta no es un XML válido')
        return res.status(400).json({
          error: 'La respuesta no es un XML válido'
        })
      }

      // Configurar headers para la descarga
      res.setHeader('Content-Type', 'application/xml')
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=factura-${invoiceNumber}.xml`
      )
      res.setHeader('X-Content-Type-Options', 'nosniff')
      res.setHeader('X-Frame-Options', 'DENY')
      res.setHeader('X-XSS-Protection', '1; mode=block')

      // Enviar el XML
      res.send(response.data)
    } catch (error) {
      console.error('[Backend Controller] Error al descargar XML:', error)
      res.status(error.status || 500).json({
        error: error.message || 'Error al descargar el XML de la factura'
      })
    }
  }
}
