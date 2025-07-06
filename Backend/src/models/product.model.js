import mongoose from 'mongoose'

const barcodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true
  },
  variant: {
    type: String
  },
  value: {
    type: Number
  }
})

const inventorySchema = new mongoose.Schema({
  current_stock: {
    type: Number,
    required: true,
    default: 0
  },
  minimum_stock: {
    type: Number,
    required: true,
    default: 0
  },
  reorder_point: {
    type: Number,
    required: true,
    default: 0
  },
  preferred_order_unit: {
    type: {
      type: String,
      enum: ['BASE', 'STACK', 'PACK'],
      default: 'BASE'
    },
    unit_measure_id: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 0
    }
  }
})

const productSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true,
    unique: true
  },
  sku: {
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
  type: {
    type: String,
    enum: ['SIMPLE', 'STACK', 'PACK'],
    required: true
  },
  is_service: {
    type: Boolean,
    default: false,
    required: true
  },
  category_id: {
    type: String,
    ref: 'Category',
    required: true
  },
  brand_id: {
    type: String,
    ref: 'Brand',
    required: true
  },
  location_id: {
    type: String,
    ref: 'Location'
  },
  barcodes: [barcodeSchema],
  base_unit: {
    unit_measure_id: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  stack_config: {
    is_stack: {
      type: Boolean,
      default: false
    },
    quantity: {
      type: Number
    },
    unit_measure_id: {
      type: Number
    },
    name: {
      type: String
    },
    base_product_uuid: {
      type: String,
      ref: 'Product'
    }
  },
  pack_config: {
    is_pack: {
      type: Boolean,
      default: false
    },
    name: {
      type: String
    },
    items: [
      {
        product_uuid: {
          type: String,
          ref: 'Product'
        },
        quantity: {
          type: Number
        },
        unit_measure_id: {
          type: Number
        }
      }
    ]
  },
  inventory: inventorySchema,
  cost: {
    type: Number,
    required: true
  },
  profit_margin: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  wholesale_price: {
    type: Number
  },
  tax_rate: {
    type: String
  },
  is_excluded: {
    type: Number,
    default: 0
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
productSchema.index({ 'barcodes.code': 1 })
productSchema.index({ category_id: 1 })
productSchema.index({ location_id: 1 })
productSchema.index({ is_service: 1 })

export const Product = mongoose.model('Product', productSchema)
