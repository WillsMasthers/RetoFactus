import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

const userSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      default: () => uuidv4(),
      unique: true,
      required: true,
      index: true
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    salt: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      uppercase: true,
      set: (value) => value ? value.toString().toUpperCase() : value
    },
    lastName: {
      type: String,
      trim: true,
      default: '',
      uppercase: true,
      set: (value) => value ? value.toString().toUpperCase() : value
    },
    rol: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user'
    },
    activo: {
      type: Boolean,
      default: true
    },
    // Empresas a las que pertenece el usuario
    empresas: [
      {
        empresa: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Company'
        },
        rol: {
          type: String,
          enum: ['admin', 'usuario', 'contador'],
          default: 'usuario'
        },
        activo: {
          type: Boolean,
          default: true
        }
      }
    ],
    // Empresa seleccionada actualmente
    empresa_actual: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company'
    },
    // Campos para roles y permisos globales
    rol_global: {
      type: String,
      enum: ['super_admin', 'admin', 'user'],
      default: 'user'
    },
    ultimo_acceso: {
      type: Date
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model('User', userSchema)
