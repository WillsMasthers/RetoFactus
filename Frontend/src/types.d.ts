/**
 * Interfaz que representa la información de la empresa emisora de la factura
 * @property {string} url_logo - URL del logo de la empresa
 * @property {string} nit - Número de Identificación Tributaria de la empresa
 * @property {string} dv - Dígito verificador del NIT
 * @property {string} company - Nombre legal de la empresa
 * @property {string} name - Nombre comercial de la empresa
 * @property {string} graphic_representation_name - Nombre para representación gráfica
 * @property {string} registration_code - Código de registro de la empresa
 * @property {string} economic_activity - Código de actividad económica
 * @property {string} phone - Teléfono de contacto
 * @property {string} email - Email de contacto
 * @property {string} direction - Dirección de la empresa
 * @property {string} municipality - Código del municipio
 * @property {string} department - Código del departamento
 * @property {Country} country - Información del país
 */
// Tipos para el servicio de empresas
export interface User {
  _id: string
  username: string
  firstName: string
  lastName: string
  email: string
  rol?: 'admin' | 'usuario' | 'contador'
  activo?: boolean
  empresas?: Array<{
    empresa: string | Company
    rol: 'admin' | 'usuario' | 'contador'
    activo: boolean
  }>
  empresa_actual?: string | Company
}

export interface CompanyFormData {
  nit: string
  razon_social: string
  direccion: string
  telefono: string
  email: string
  pais: string
  departamento?: string
  ciudad?: string
  tipo_documento: string
  codigo_postal?: string
  url_logo?: string
  nombre_comercial?: string
  
  // Alias para compatibilidad
  company?: string
  name?: string
  phone?: string
  department?: string
  municipality?: string
  direction?: string
  dv?: string
  economic_activity?: string
  registration_code?: string
  graphic_representation_name?: string
  actividad_economica?: string
  matricula_mercantil?: string
  representacion_grafica?: string
}

export interface AddUserToCompanyData {
  userId: string
  rol: 'admin' | 'usuario' | 'contador'
}

export interface UpdateUserRoleData {
  rol: 'admin' | 'usuario' | 'contador'
}

export interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
  error?: string
}

// Tipos de respuesta de la API para el servicio de empresas
export interface CompanyResponse {
  success: boolean
  data?: Company
  message?: string
  error?: string
}

export interface CompaniesResponse {
  success: boolean
  companies: Company[]
  message?: string
  error?: string
}

export interface UsersResponse {
  success: boolean
  data?: User[]
  message?: string
  error?: string
}

// Tipos para ubicaciones
export interface Municipio {
  id: number
  code: string
  name: string
}

export interface Departamento {
  id: number
  code: string
  name: string
  municipios: Municipio[]
}

// Tipo para el formulario de la empresa
export interface FormData {
  // Identificación
  identification: {
    nit: string
    dv: string
    document_type: string
  }
  
  // Datos básicos
  name: {
    company: string
    commercial: string
    graphic_representation: string
    registration: {
      code: string
      economic_activity: string
    }
  }
  
  // Contacto
  contact: {
    email: string
    phone: string
  }
  
  // Ubicación
  location: {
    country: string
    department: string
    municipality: string
    address: string
    postal_code: string
  }
  
  // Logo
  logo: {
    url: string
    public_id?: string
  }
  
  // Configuración de facturación
  billing_config?: {
    invoice_prefix?: string
    invoice_resolution?: string
    invoice_start_number?: number
    invoice_end_number?: number
    invoice_current_number?: number
    invoice_notes?: string
    payment_terms?: string
    payment_methods?: string[]
    taxes?: string[]
  }
  
  // Campos adicionales para el formulario
  tipo_documento?: string // Alias para identification.document_type
  razon_social?: string  // Alias para name.company
  nombre_comercial?: string // Alias para name.commercial
  email?: string         // Alias para contact.email
  telefono?: string      // Alias para contact.phone
  direccion?: string     // Alias para location.address
  pais?: string          // Alias para location.country
  departamento?: string  // Alias para location.department
  ciudad?: string        // Alias para location.municipality
  codigo_postal?: string // Alias para location.postal_code
  url_logo?: string      // Alias para logo.url
}

// Exportar todos los tipos
export type { Municipio, Departamento }

export interface Company {
  _id: string
  identification: {
    nit: string
    dv: string
    document_type: string
  }
  name: {
    company: string
    commercial: string
    graphic_representation: string
    registration: {
      code: string
      economic_activity: string
    }
  }
  contact: {
    email: string
    phone: string
  }
  location: {
    country: string
    department: string
    municipality: string
    address: string
    postal_code: string
  }
  logo: {
    url: string
    public_id?: string
  }
  billing_config?: {
    invoice_prefix?: string
    invoice_resolution?: string
    invoice_start_number?: number
    invoice_end_number?: number
    invoice_current_number?: number
    invoice_notes?: string
    payment_terms?: string
    payment_methods?: string[]
    taxes?: string[]
  }
  is_active: boolean
  created_at: string
  updated_at: string
}

/**
 * Interfaz que representa el tipo de organización legal del cliente
 * @property {number} id - Identificador único del tipo de organización
 * @property {string} code - Código del tipo de organización (ej: '2' para Persona Natural)
 * @property {string} name - Nombre descriptivo del tipo de organización
 */
export interface LegalOrganization {
  id: number
  code: string
  name: string
}

/**
 * Interfaz que representa un tributo o impuesto
 * @property {number} id - Identificador único del tributo
 * @property {string} code - Código del tributo (ej: '01' para IVA)
 * @property {string} name - Nombre descriptivo del tributo
 */
export interface Tribute {
  id: number
  code: string
  name: string
}

/**
 * Interfaz que representa un país
 * @property {number} id - Identificador único del país
 * @property {string} code - Código del país (ej: 'CO' para Colombia)
 * @property {string} name - Nombre del país
 */
export interface Country {
  id: number
  code: string
  name: string
}

// Declaración de tipos para el archivo JSON de países
declare module '../public/data/paises.json' {
  const value: {
    data: Country[]
  }
  export default value
}

/**
 * Interfaz que representa un departamento
 * @property {number} id - Identificador único del departamento
 * @property {string} code - Código del departamento
 * @property {string} name - Nombre del departamento
 * @property {string} department - Nombre del departamento al que pertenece
 */
export interface Department {
  id: number
  code: string
  name: string
  department: string
}

/**
 * Interfaz que representa un municipio
 * @property {number} id - Identificador único del municipio
 * @property {string} code - Código del municipio (ej: '91263' para El Encanto)
 * @property {string} name - Nombre del municipio
 * @property {string} department - Nombre del departamento al que pertenece
 */
export interface Municipality {
  id: number
  code: string
  name: string
  department: string
}

/**
 * Interfaz que representa la información del cliente
 * @property {string} identification - Número de identificación del cliente
 * @property {string | null} dv - Dígito verificador de la identificación
 * @property {string} graphic_representation_name - Nombre para representación gráfica
 * @property {string} trade_name - Nombre comercial
 * @property {string} company - Nombre de la empresa si es una organización
 * @property {string} names - Nombres del cliente
 * @property {string} address - Dirección del cliente
 * @property {string} email - Email de contacto
 * @property {string} phone - Teléfono de contacto
 * @property {LegalOrganization} legal_organization - Tipo de organización legal
 * @property {Tribute} tribute - Tipo de tributo aplicable
 * @property {Municipality} municipality - Municipio de ubicación
 */
export interface Customer {
  identification: string
  dv: string | null
  graphic_representation_name: string
  trade_name: string
  company: string
  names: string
  address: string
  email: string
  phone: string
  legal_organization: LegalOrganization
  tribute: Tribute
  municipality: Municipality
}

export interface NumberingRange {
  prefix: string
  from: number
  to: number
  resolution_number: string
  start_date: string
  end_date: string
  months: number
}

export interface Document {
  code: string
  name: string
}

export interface PaymentForm {
  code: string
  name: string
}

export interface PaymentMethod {
  code: string
  name: string
}

export interface UnitMeasure {
  id: number
  code: string
  name: string
}

export interface StandardCode {
  id: number
  code: string
  name: string
}

export interface TaxRate {
  code: string
  name: string
  rate: string
}

export interface WithholdingTax {
  tribute_code: string
  name: string
  value: string
  rates?: TaxRate[]
}

export interface Item {
  code_reference: string
  name: string
  quantity: number
  discount_rate: string
  discount: string
  gross_value: string
  tax_rate: string
  taxable_amount: string
  tax_amount: string
  price: string
  is_excluded: number
  unit_measure: UnitMeasure
  standard_code: StandardCode
  tribute: Tribute
  total: number
  withholding_taxes: WithholdingTax[]
}

export interface Bill {
  id: number
  document: Document
  number: string
  reference_code: string
  status: number
  send_email: number
  qr: string
  cufe: string
  validated: string
  discount_rate: string
  discount: string
  gross_value: string
  taxable_amount: string
  tax_amount: string
  total: string
  observation: string | null
  errors: string[]
  created_at: string
  payment_due_date: string | null
  qr_image: string
  has_claim: number
  is_negotiable_instrument: number
  payment_form: PaymentForm
  payment_method: PaymentMethod
}

// Interfaz para el período de facturación
export interface BillingPeriod {
  start_date: string
  end_date: string
  description?: string
}

// Interfaz para documentos relacionados
export interface RelatedDocument {
  id: string
  type: string
  number: string
  issue_date: string
}

// Interfaz para notas de crédito/débito
export interface NoteBase {
  id: string
  number: string
  issue_date: string
  total: number
  status: string
}

// Usamos tipos directos en lugar de interfaces vacías
type CreditNote = NoteBase
type DebitNote = NoteBase

export interface FacturaResponse {
  status: string
  message: string
  data: {
    company: Company
    customer: Customer
    numbering_range: NumberingRange
    billing_period: BillingPeriod[]
    bill: Bill
    related_documents: RelatedDocument[]
    items: Item[]
    withholding_taxes: WithholdingTax[]
    credit_notes: CreditNote[]
    debit_notes: DebitNote[]
  }
}

// ============================================
// TIPOS PARA GESTIÓN DE INVENTARIO
// ============================================

/**
 * Interfaz que representa una marca de producto
 * @property {string} uuid - Identificador único de la marca
 * @property {string} name - Nombre de la marca
 * @property {string} [description] - Descripción opcional de la marca
 * @property {Object} [informacion] - Información adicional de la marca
 * @property {string} [informacion.titulo] - Título descriptivo de la marca
 * @property {string} [informacion.url] - URL relacionada con la marca
 * @property {string} [informacion.descripcion] - Descripción detallada de la marca
 * @property {boolean} is_active - Indica si la marca está activa
 * @property {Date | string} created_at - Fecha de creación
 * @property {Date | string} updated_at - Fecha de última actualización
 */
export interface Brand {
  uuid: string
  name: string
  description?: string
  informacion?: {
    titulo?: string
    url?: string
    descripcion?: string
  }
  is_active: boolean
  created_at: Date | string
  updated_at: Date | string
}

/**
 * Interfaz que representa una categoría de producto
 * @property {string} uuid - Identificador único de la categoría
 * @property {string} name - Nombre de la categoría
 * @property {string} [description] - Descripción opcional de la categoría
 * @property {string} [parent_id] - ID de la categoría padre (para jerarquías)
 * @property {number} level - Nivel en la jerarquía de categorías
 * @property {string} path - Ruta completa en la jerarquía
 * @property {Object} [customization] - Personalización visual de la categoría
 * @property {string} [customization.color] - Color asociado a la categoría
 * @property {string} [customization.icon] - Ícono asociado a la categoría
 * @property {string} [customization.image_url] - URL de la imagen de la categoría
 * @property {boolean} is_active - Indica si la categoría está activa
 * @property {Date | string} created_at - Fecha de creación
 * @property {Date | string} updated_at - Fecha de última actualización
 */
export interface Category {
  uuid: string
  name: string
  description?: string
  parent_id?: string
  level: number
  path: string
  customization?: {
    color?: string
    icon?: string
    image_url?: string
  }
  is_active: boolean
  created_at: Date | string
  updated_at: Date | string
}

/**
 * Interfaz que representa un código de barras
 * @property {string} code - Código de barras
 * @property {string} [variant] - Variante del producto (si aplica)
 * @property {number} [value] - Valor asociado al código de barras (si aplica)
 */
interface Barcode {
  code: string
  variant?: string
  value?: number
}

/**
 * Interfaz que representa la configuración de inventario de un producto
 * @property {number} current_stock - Cantidad actual en inventario
 * @property {number} minimum_stock - Nivel mínimo de inventario
 * @property {number} reorder_point - Punto de reorden
 * @property {Object} preferred_order_unit - Unidad de medida preferida para pedidos
 * @property {string} preferred_order_unit.type - Tipo de unidad (BASE, STACK, PACK)
 * @property {number} preferred_order_unit.unit_measure_id - ID de la unidad de medida
 * @property {string} preferred_order_unit.name - Nombre de la unidad de medida
 * @property {number} preferred_order_unit.quantity - Cantidad en la unidad de medida
 */
interface InventoryConfig {
  current_stock: number
  minimum_stock: number
  reorder_point: number
  preferred_order_unit: {
    type: 'BASE' | 'STACK' | 'PACK'
    unit_measure_id: number
    name: string
    quantity: number
  }
}

/**
 * Interfaz que representa un producto en el sistema
 * @property {string} uuid - Identificador único del producto
 * @property {string} sku - Código SKU único del producto
 * @property {string} name - Nombre del producto
 * @property {string} [description] - Descripción del producto
 * @property {'SIMPLE' | 'STACK' | 'PACK'} type - Tipo de producto
 * @property {boolean} is_service - Indica si es un servicio
 * @property {string} category_id - ID de la categoría a la que pertenece
 * @property {string} [location_id] - ID de la ubicación física
 * @property {Barcode[]} [barcodes] - Códigos de barras asociados
 * @property {Object} base_unit - Unidad base del producto
 * @property {number} base_unit.unit_measure_id - ID de la unidad de medida
 * @property {string} base_unit.name - Nombre de la unidad de medida
 * @property {Object} [stack_config] - Configuración para productos tipo STACK
 * @property {boolean} [stack_config.is_stack] - Indica si es un stack
 * @property {number} [stack_config.quantity] - Cantidad en el stack
 * @property {number} [stack_config.unit_measure_id] - ID de la unidad de medida del stack
 * @property {string} [stack_config.name] - Nombre del stack
 * @property {string} [stack_config.base_product_uuid] - UUID del producto base
 * @property {Object} [pack_config] - Configuración para productos tipo PACK
 * @property {boolean} [pack_config.is_pack] - Indica si es un pack
 * @property {string} [pack_config.name] - Nombre del pack
 * @property {Array<{product_uuid: string, quantity: number, unit_measure_id: number}>} [pack_config.items] - Items del pack
 * @property {InventoryConfig} inventory - Configuración de inventario
 * @property {number} cost - Costo del producto
 * @property {number} profit_margin - Margen de ganancia (porcentaje)
 * @property {number} price - Precio de venta
 * @property {number} [wholesale_price] - Precio al por mayor
 * @property {string} [tax_rate] - Tasa de impuesto
 * @property {number} is_excluded - Indica si está excluido de ciertos cálculos
 * @property {Object} [customization] - Personalización del producto
 * @property {string} [customization.color] - Color del producto
 * @property {string} [customization.icon] - Ícono del producto
 * @property {string} [customization.image_url] - URL de la imagen del producto
 * @property {string} brand_id - ID de la marca del producto
 * @property {boolean} is_active - Indica si el producto está activo
 * @property {Date | string} created_at - Fecha de creación
 * @property {Date | string} updated_at - Fecha de última actualización
 */
export interface Product {
  uuid: string
  sku: string
  name: string
  description?: string
  type: 'SIMPLE' | 'STACK' | 'PACK'
  is_service: boolean
  category_id: string
  location_id?: string
  barcodes?: Barcode[]
  base_unit: {
    unit_measure_id: number
    name: string
  }
  stack_config?: {
    is_stack?: boolean
    quantity?: number
    unit_measure_id?: number
    name?: string
    base_product_uuid?: string
  }
  pack_config?: {
    is_pack?: boolean
    name?: string
    items?: Array<{
      product_uuid: string
      quantity: number
      unit_measure_id: number
    }>
  }
  inventory: InventoryConfig
  cost: number
  profit_margin: number
  price: number
  wholesale_price?: number
  tax_rate?: string
  is_excluded: number
  customization?: {
    color?: string
    icon?: string
    image_url?: string
  }
  brand_id: string
  is_active: boolean
  created_at: Date | string
  updated_at: Date | string
}

/**
 * Interfaz para la respuesta de la API de productos
 * @template T - Tipo de dato contenido en la respuesta
 */
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

/**
 * Interfaz para la respuesta paginada de la API
 * @template T - Tipo de los elementos en la lista
 */
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
