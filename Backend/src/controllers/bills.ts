import { Request, Response } from 'express'
import { factusService } from '../services/factusService'

export const getFactusInvoices = async (req: Request, res: Response) => {
  try {
    const response = await factusService.getInvoices(req.query)
    res.json(response.data)
  } catch (error: any) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || 'Error al obtener facturas'
    })
  }
}

export const getInvoiceDetails = async (req: Request, res: Response) => {
  try {
    const { number } = req.params
    const response = await factusService.getInvoiceDetails(number)
    res.json(response.data)
  } catch (error: any) {
    res.status(error.response?.status || 500).json({
      error:
        error.response?.data?.message ||
        'Error al obtener detalles de la factura'
    })
  }
}

export const downloadInvoicePDF = async (req: Request, res: Response) => {
  try {
    const { number } = req.params
    const response = await factusService.downloadInvoicePDF(number)

    // Configurar headers para la descarga
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=factura-${number}.pdf`
    )

    // Enviar el PDF
    res.send(response.data)
  } catch (error: any) {
    res.status(error.response?.status || 500).json({
      error:
        error.response?.data?.message ||
        'Error al descargar el PDF de la factura'
    })
  }
}
