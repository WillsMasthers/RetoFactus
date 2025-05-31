import mongoose from 'mongoose'

const dianCatalogSchema = new mongoose.Schema(
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
    // Versión de la resolución DIAN
    version_resolucion: {
      type: String,
      required: true
    },
    fecha_resolucion: {
      type: Date,
      required: true
    },
    // Datos específicos del catálogo
    datos: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  },
  {
    timestamps: true
  }
)

// Índice compuesto para asegurar unicidad por tipo y código
dianCatalogSchema.index({ tipo: 1, codigo: 1 }, { unique: true })

// Método estático para verificar si hay una nueva versión disponible
dianCatalogSchema.statics.checkNewVersion = async function (tipo, version) {
  const latest = await this.findOne({ tipo })
    .sort({ fecha_resolucion: -1 })
    .select('version_resolucion')

  return latest && latest.version_resolucion !== version
}

export default mongoose.model('DianCatalog', dianCatalogSchema)
