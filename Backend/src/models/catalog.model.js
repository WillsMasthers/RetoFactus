import mongoose from 'mongoose'

export const catalogSchema = new mongoose.Schema(
  {
    tipo: {
      type: String,
      required: true,
      enum: [
        'paises',
        'ubicaciones',
        'tributos',
        'tributosProductos',
        'tiposDocumentos',
        'mediosPagos',
        'medidas'
      ]
    },
    codigo: {
      type: String,
      required: true
    },
    nombre: {
      type: String,
      required: true
    },
    activo: {
      type: Boolean,
      default: true
    },
    // Campos adicionales específicos por tipo de catálogo
    datos_adicionales: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  {
    timestamps: true
  }
)

// Índice compuesto para asegurar unicidad por tipo y código
catalogSchema.index({ tipo: 1, codigo: 1 }, { unique: true })

export default mongoose.model('Catalog', catalogSchema)
