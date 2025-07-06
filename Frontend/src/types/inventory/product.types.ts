import { Brand } from './brand.types'
import { Category } from './category.types'

/**
 * Tipo de producto
 */
export type ProductType = 'SIMPLE' | 'VARIANT' | 'BUNDLE' | 'DIGITAL'

/**
 * Estado de inventario del producto
 */
export enum InventoryStatus {
  IN_STOCK = 'IN_STOCK',
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  DISCONTINUED = 'DISCONTINUED'
}

/**
 * Unidad de medida del producto
 */
export interface ProductUnit {
  /** Identificador de la unidad */
  id: string
  /** Nombre de la unidad (ej: "Unidad", "Kg", "Litro") */
  name: string
  /** Símbolo de la unidad (ej: "u", "kg", "L") */
  symbol: string
  /** Factor de conversión a la unidad base */
  conversion_factor: number
}

/**
 * Atributo de variante (tamaño, color, etc.)
 */
export interface ProductAttribute {
  /** Identificador del atributo */
  id: string
  /** Nombre del atributo (ej: "Color", "Tamaño") */
  name: string
  /** Valores posibles del atributo */
  values: string[]
}

/**
 * Opción de variante específica
 */
export interface ProductVariantOption {
  /** Nombre del atributo */
  name: string
  /** Valor seleccionado */
  value: string
}

/**
 * Variante de producto
 */
export interface ProductVariant {
  /** SKU único de la variante */
  sku: string
  /** Opciones que definen esta variante */
  options: ProductVariantOption[]
  /** Precio (anula el precio base si está definido) */
  price?: number
  /** SKU del proveedor */
  supplier_sku?: string
  /** Código de barras */
  barcode?: string
  /** Cantidad en inventario */
  stock_quantity: number
  /** Nivel de stock mínimo */
  stock_threshold: number
  /** Peso en gramos */
  weight?: number
  /** Ancho en centímetros */
  width?: number
  /** Alto en centímetros */
  height?: number
  /** Profundidad en centímetros */
  depth?: number
  /** URL de la imagen específica de la variante */
  image_url?: string
}

/**
 * Producto base
 */
export interface BaseProduct {
  /** Identificador único */
  uuid: string
  /** SKU único */
  sku: string
  /** Nombre del producto */
  name: string
  /** Descripción corta */
  short_description?: string
  /** Descripción larga (HTML permitido) */
  description?: string
  /** Tipo de producto */
  type: ProductType
  /** Estado en el inventario */
  status: InventoryStatus
  /** Marca del producto */
  brand?: Brand | null
  /** Categorías a las que pertenece */
  categories: Category[]
  /** Precio base */
  price: number
  /** Precio de oferta */
  sale_price?: number
  /** Fecha de inicio de oferta */
  sale_start_date?: Date | string | null
  /** Fecha de fin de oferta */
  sale_end_date?: Date | string | null
  /** Costo del producto */
  cost?: number
  /** Impuesto aplicable (porcentaje) */
  tax_rate?: number
  /** Código SKU del proveedor */
  supplier_sku?: string
  /** Código de barras */
  barcode?: string
  /** Peso en gramos */
  weight?: number
  /** Ancho en centímetros */
  width?: number
  /** Alto en centímetros */
  height?: number
  /** Profundidad en centímetros */
  depth?: number
  /** Unidad de medida */
  unit: ProductUnit
  /** Cantidad en inventario */
  stock_quantity: number
  /** Nivel de stock mínimo */
  stock_threshold: number
  /** ¿Permite pedidos cuando no hay stock? */
  backorders_allowed: boolean
  /** Cantidad de pedidos pendientes */
  backorder_quantity?: number
  /** ¿Se requiere envío? */
  requires_shipping: boolean
  /** ¿Es descargable? */
  is_downloadable: boolean
  /** URLs de descarga */
  download_urls?: string[]
  /** ¿Es virtual? */
  is_virtual: boolean
  /** ¿Está destacado? */
  is_featured: boolean
  /** ¿Está en oferta? */
  on_sale: boolean
  /** Calificación media */
  average_rating?: number
  /** Número de valoraciones */
  rating_count?: number
  /** Total de ventas */
  total_sales: number
  /** Fecha de creación */
  created_at: string | Date
  /** Fecha de última actualización */
  updated_at: string | Date
  /** Fecha de publicación */
  published_at?: string | Date | null
  /** Imágenes del producto */
  images: string[]
  /** Etiquetas (tags) */
  tags?: string[]
  /** Atributos del producto */
  attributes: ProductAttribute[]
  /** Variantes del producto */
  variants?: ProductVariant[]
  /** Productos incluidos (para paquetes) */
  bundled_products?: BundledProduct[]
  /** Metadatos personalizados */
  metadata?: Record<string, any>
}

/**
 * Producto agrupado (para paquetes/kits)
 */
export interface BundledProduct {
  /** ID del producto incluido */
  product_id: string
  /** Cantidad incluida */
  quantity: number
  /** Precio fijo (opcional, anula el cálculo automático) */
  fixed_price?: number
  /** ¿Es obligatorio en el paquete? */
  is_required: boolean
  /** ¿Permite cambiar la cantidad? */
  allow_quantity_change: boolean
  /** ¿Permite sustituir por otro producto? */
  allow_substitution: boolean
  /** Producto de referencia (puede estar parcialmente cargado) */
  product?: Pick<BaseProduct, 'uuid' | 'name' | 'sku' | 'price' | 'images'>
}

/**
 * Producto con relaciones expandidas
 */
export interface Product extends BaseProduct {
  /** Marca expandida */
  brand: Brand | null
  /** Categorías expandidas */
  categories: Category[]
}

/**
 * Producto con relaciones mínimas para listados
 */
export type ProductListItem = Pick<
  Product,
  | 'uuid'
  | 'sku'
  | 'name'
  | 'price'
  | 'sale_price'
  | 'stock_quantity'
  | 'status'
  | 'images'
  | 'created_at'
> & {
  brand?: Pick<Brand, 'uuid' | 'name'> | null
  categories: Array<Pick<Category, 'uuid' | 'name'>>
}

/**
 * Datos para crear un nuevo producto
 */
export type CreateProductDto = Omit<
  BaseProduct,
  | 'uuid'
  | 'created_at'
  | 'updated_at'
  | 'status'
  | 'average_rating'
  | 'rating_count'
  | 'total_sales'
  | 'on_sale'
  | 'variants'
> & {
  brand_id?: string | null
  category_ids: string[]
  variants?: Omit<ProductVariant, 'sku'>[]
}

/**
 * Datos para actualizar un producto existente
 */
export type UpdateProductDto = Partial<CreateProductDto>

/**
 * Filtros para consultar productos
 */
export interface ProductFilters {
  /** Texto para búsqueda en nombre, descripción o SKU */
  search?: string
  /** Filtrar por marcas */
  brand_ids?: string[]
  /** Filtrar por categorías */
  category_ids?: string[]
  /** Filtrar por estado de inventario */
  status?: InventoryStatus[]
  /** Filtrar por tipo de producto */
  type?: ProductType[]
  /** Precio mínimo */
  min_price?: number
  /** Precio máximo */
  max_price?: number
  /** ¿Incluir solo productos en oferta? */
  on_sale?: boolean
  /** ¿Incluir solo productos destacados? */
  featured?: boolean
  /** ¿Incluir solo productos con stock? */
  in_stock?: boolean
  /** Ordenar por campo */
  sort_by?: 'name' | 'price' | 'created_at' | 'updated_at' | 'total_sales' | 'average_rating'
  /** Orden ascendente o descendente */
  sort_order?: 'asc' | 'desc'
  /** Página actual (para paginación) */
  page?: number
  /** Elementos por página */
  limit?: number
}
