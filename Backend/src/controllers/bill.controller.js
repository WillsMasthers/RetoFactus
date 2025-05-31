import Bill from '../models/bill.model.js'
import {
  billSchema,
  updateBillSchema,
  filterBillSchema
} from '../schemas/bill.schema.js'

// Crear una nueva factura
export const createBill = async (req, res) => {
  try {
    // Validar los datos de entrada
    const validatedData = billSchema.parse(req.body)

    // Crear la factura con el usuario que la crea
    const bill = new Bill({
      ...validatedData,
      created_by: req.user._id
    })

    await bill.save()

    res.status(201).json({
      success: true,
      message: 'Factura creada exitosamente',
      data: bill
    })
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Datos de factura inválidos',
        errors: error.errors
      })
    }

    res.status(500).json({
      success: false,
      message: 'Error al crear la factura',
      error: error.message
    })
  }
}

// Obtener todas las facturas
export const getBills = async (req, res) => {
  try {
    // Validar los filtros
    const filters = filterBillSchema.parse(req.query)

    // Construir el query
    const query = {}
    if (filters.number) query.number = filters.number
    if (filters.status) query.status = filters.status
    if (filters.customerIdentification)
      query['customer.identification'] = filters.customerIdentification
    if (filters.startDate && filters.endDate) {
      query.createdAt = {
        $gte: new Date(filters.startDate),
        $lte: new Date(filters.endDate)
      }
    }

    const bills = await Bill.find(query)
      .populate('created_by', 'nombre email')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      data: bills
    })
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Filtros inválidos',
        errors: error.errors
      })
    }

    res.status(500).json({
      success: false,
      message: 'Error al obtener las facturas',
      error: error.message
    })
  }
}

// Obtener una factura por ID
export const getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id).populate(
      'created_by',
      'nombre email'
    )

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Factura no encontrada'
      })
    }

    res.json({
      success: true,
      data: bill
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener la factura',
      error: error.message
    })
  }
}

// Actualizar una factura
export const updateBill = async (req, res) => {
  try {
    // Validar los datos de actualización
    const validatedData = updateBillSchema.parse(req.body)

    const bill = await Bill.findById(req.params.id)

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Factura no encontrada'
      })
    }

    // Verificar si el usuario es el creador de la factura
    if (bill.created_by.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para actualizar esta factura'
      })
    }

    // Actualizar la factura
    Object.assign(bill, validatedData)
    await bill.save()

    res.json({
      success: true,
      message: 'Factura actualizada exitosamente',
      data: bill
    })
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Datos de actualización inválidos',
        errors: error.errors
      })
    }

    res.status(500).json({
      success: false,
      message: 'Error al actualizar la factura',
      error: error.message
    })
  }
}

// Eliminar una factura
export const deleteBill = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id)

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Factura no encontrada'
      })
    }

    // Verificar si el usuario es el creador de la factura
    if (bill.created_by.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para eliminar esta factura'
      })
    }

    await bill.deleteOne()

    res.json({
      success: true,
      message: 'Factura eliminada exitosamente'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la factura',
      error: error.message
    })
  }
}
