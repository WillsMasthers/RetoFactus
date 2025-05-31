import { z } from 'zod'

// Schema para la organización legal
const legalOrganizationSchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string()
})

// Schema para tributos
const tributeSchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string()
})

// Schema para municipio
const municipalitySchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string()
})

// Schema para medidas unitarias
const unitMeasureSchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string()
})

// Schema para códigos estándar
const standardCodeSchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string()
})

// Schema para tasas de retención
const withholdingTaxRateSchema = z.object({
  code: z.string(),
  name: z.string(),
  rate: z.string()
})

// Schema para impuestos de retención
const withholdingTaxSchema = z.object({
  tribute_code: z.string(),
  name: z.string(),
  value: z.string(),
  rates: z.array(withholdingTaxRateSchema)
})

// Schema para items de la factura
const billItemSchema = z.object({
  code_reference: z.string().optional(),
  name: z.string(),
  quantity: z.number(),
  discount_rate: z.string().optional(),
  discount: z.string().optional(),
  gross_value: z.string().optional(),
  tax_rate: z.string().optional(),
  taxable_amount: z.string().optional(),
  tax_amount: z.string().optional(),
  price: z.string().optional(),
  is_excluded: z.number().optional(),
  unit_measure: unitMeasureSchema,
  standard_code: standardCodeSchema,
  tribute: tributeSchema,
  total: z.number(),
  withholding_taxes: z.array(withholdingTaxSchema).optional()
})

// Schema para la compañía
const companySchema = z.object({
  url_logo: z.string().optional(),
  nit: z.string(),
  dv: z.string().optional(),
  company: z.string(),
  name: z.string(),
  graphic_representation_name: z.string().optional(),
  registration_code: z.string().optional(),
  economic_activity: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  direction: z.string().optional(),
  municipality: z.string().optional()
})

// Schema para el cliente
const customerSchema = z.object({
  identification: z.string(),
  dv: z.string().optional(),
  graphic_representation_name: z.string().optional(),
  trade_name: z.string().optional(),
  company: z.string().optional(),
  names: z.string().optional(),
  address: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  legal_organization: legalOrganizationSchema,
  tribute: tributeSchema,
  municipality: municipalitySchema
})

// Schema principal para la factura
export const billSchema = z.object({
  number: z.string(),
  company: companySchema,
  customer: customerSchema,
  items: z.array(billItemSchema),
  withholding_taxes: z
    .array(
      z.object({
        tribute_code: z.string(),
        name: z.string(),
        value: z.string()
      })
    )
    .optional(),
  status: z.enum(['Created', 'Pending', 'Validated', 'Rejected']).optional()
})

// Schema para actualizar una factura
export const updateBillSchema = billSchema.partial()

// Schema para filtrar facturas
export const filterBillSchema = z.object({
  number: z.string().optional(),
  status: z.enum(['Created', 'Pending', 'Validated', 'Rejected']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  customerIdentification: z.string().optional()
})
