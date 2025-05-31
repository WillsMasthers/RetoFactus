import mongoose from 'mongoose'

const companySchema = new mongoose.Schema(
  {
    // Identificación de la empresa
    identification: {
      nit: {
        type: String,
        required: true,
        unique: true,
        trim: true
      },
      dv: {
        type: String,
        trim: true,
        required: true
      },
      document_type: {
        type: String,
        default: 'NIT',
        set: function(value) {
          this.tipo_documento = value; // Mantener sincronizado con el campo legado
          return value;
        }
      }
    },
    
    // Nombre y datos de la empresa
    name: {
      company: {
        type: String,
        required: true,
        trim: true,
        set: function(value) {
          this.razon_social = value; // Mantener sincronizado con el campo legado
          return value;
        }
      },
      commercial: {
        type: String,
        trim: true,
        default: function() { return this.name?.company; }
      },
      graphic_representation: {
        type: String,
        trim: true,
        default: function() { return this.name?.company; }
      },
      registration: {
        code: {
          type: String,
          trim: true
        },
        economic_activity: {
          type: String,
          trim: true
        }
      }
    },
    
    // Información de contacto
    contact: {
      email: {
        type: String,
        trim: true,
        lowercase: true,
        required: true
      },
      phone: {
        type: String,
        trim: true,
        set: function(value) {
          this.telefono = value; // Mantener sincronizado con el campo legado
          return value;
        }
      }
    },
    
    // Ubicación
    location: {
      country: {
        type: String,
        default: 'CO',
        set: function(value) {
          this.pais = value; // Mantener sincronizado con el campo legado
          return value;
        }
      },
      department: {
        type: String,
        trim: true,
        set: function(value) {
          this.departamento = value; // Mantener sincronizado con el campo legado
          return value;
        }
      },
      municipality: {
        type: String,
        trim: true,
        set: function(value) {
          this.ciudad = value; // Mantener sincronizado con el campo legado
          return value;
        }
      },
      address: {
        type: String,
        trim: true,
        set: function(value) {
          this.direccion = value; // Mantener sincronizado con el campo legado
          return value;
        }
      },
      postal_code: {
        type: String,
        trim: true,
        set: function(value) {
          this.codigo_postal = value; // Mantener sincronizado con el campo legado
          return value;
        }
      }
    },
    
    // Logo de la empresa
    logo: {
      url: {
        type: String,
        trim: true
      }
    },
    
    // Configuración
    
    // Referencias a usuarios
    administrador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    usuarios: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    
    // Configuración de facturación
    billing_configuration: {
      invoice_prefix: {
        type: String,
        trim: true
      },
      resolution_number: {
        type: String,
        trim: true
      },
      resolution_date: {
        type: Date
      },
      initial_range: {
        type: Number
      },
      final_range: {
        type: Number
      },
      expiration_date: {
        type: Date
      },
      payment_methods: [{
        type: String,
        ref: 'Catalog'
      }],
      taxes: [{
        type: String,
        ref: 'Catalog'
      }]
    },
    
    // Estado
    is_active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model('Company', companySchema)
