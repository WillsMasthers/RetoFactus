import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

const brandSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true,
    unique: true,
    default: uuidv4
  },
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  informacion: {
    titulo: {
      type: String,
      trim: true,
      default: ''
    },
    url: {
      type: String,
      trim: true,
      default: ''
    },
    descripcion: {
      type: String,
      trim: true,
      default: ''
    }
  },
  is_active: {
    type: Boolean,
    default: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
})

// Índices
brandSchema.index({ name: 1 })


// Middleware para actualizar la fecha de actualización
brandSchema.pre('save', function(next) {
  this.updated_at = new Date()
  next()
})

export const Brand = mongoose.model('Brand', brandSchema)
