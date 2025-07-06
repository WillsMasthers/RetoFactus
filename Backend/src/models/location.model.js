import mongoose from 'mongoose'

const locationSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  parent_id: {
    type: String,
    ref: 'Location',
    default: null
  },
  level: {
    type: Number,
    required: true,
    default: 1
  },
  path: {
    type: String,
    required: true
  },
  customization: {
    color: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    image_url: {
      type: String,
      default: null
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
locationSchema.index({ uuid: 1 })
locationSchema.index({ parent_id: 1 })
locationSchema.index({ path: 1 })

export const Location = mongoose.model('Location', locationSchema)
