import mongoose from 'mongoose'

const billSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    company: {
      url_logo: String,
      nit: {
        type: String,
        required: true,
        trim: true
      },
      dv: String,
      company: {
        type: String,
        required: true,
        trim: true
      },
      name: {
        type: String,
        required: true,
        trim: true
      },
      graphic_representation_name: String,
      registration_code: String,
      economic_activity: String,
      phone: String,
      email: String,
      direction: String,
      municipality: String
    },
    customer: {
      identification: {
        type: String,
        required: true,
        trim: true
      },
      dv: String,
      graphic_representation_name: String,
      trade_name: String,
      company: String,
      names: String,
      address: String,
      email: String,
      phone: String,
      legal_organization: {
        id: Number,
        code: String,
        name: String
      },
      tribute: {
        id: Number,
        code: String,
        name: String
      },
      municipality: {
        id: Number,
        code: String,
        name: String
      }
    },
    items: [
      {
        code_reference: String,
        name: {
          type: String,
          required: true
        },
        quantity: {
          type: Number,
          required: true
        },
        discount_rate: String,
        discount: String,
        gross_value: String,
        tax_rate: String,
        taxable_amount: String,
        tax_amount: String,
        price: String,
        is_excluded: Number,
        unit_measure: {
          id: Number,
          code: String,
          name: String
        },
        standard_code: {
          id: Number,
          code: String,
          name: String
        },
        tribute: {
          id: Number,
          code: String,
          name: String
        },
        total: Number,
        withholding_taxes: [
          {
            tribute_code: String,
            name: String,
            value: String,
            rates: [
              {
                code: String,
                name: String,
                rate: String
              }
            ]
          }
        ]
      }
    ],
    withholding_taxes: [
      {
        tribute_code: String,
        name: String,
        value: String
      }
    ],
    credit_notes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CreditNote'
      }
    ],
    debit_notes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DebitNote'
      }
    ],
    status: {
      type: String,
      enum: ['Created', 'Pending', 'Validated', 'Rejected'],
      default: 'Created'
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model('Bill', billSchema)
