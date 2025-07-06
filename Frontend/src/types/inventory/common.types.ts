/**
 * Estado de disponibilidad de un recurso
 */
export enum AvailabilityStatus {
  /** Disponible para su uso */
  AVAILABLE = 'AVAILABLE',
  /** No disponible temporalmente */
  UNAVAILABLE = 'UNAVAILABLE',
  /** Descontinuado */
  DISCONTINUED = 'DISCONTINUED'
}

/**
 * Unidad de medida estándar
 */
export interface UnitOfMeasure {
  /** Código único de la unidad */
  code: string
  /** Nombre de la unidad */
  name: string
  /** Símbolo de la unidad (opcional) */
  symbol?: string
  /** Tipo de unidad (peso, volumen, cantidad, etc.) */
  type: 'weight' | 'volume' | 'length' | 'quantity' | 'other'
  /** Factor de conversión a la unidad base */
  conversion_factor: number
  /** ¿Es la unidad base para su tipo? */
  is_base_unit: boolean
}

/**
 * Atributo genérico para productos
 */
export interface Attribute {
  /** Identificador único */
  id: string
  /** Nombre del atributo */
  name: string
  /** Valores posibles */
  values: string[]
  /** ¿Es visible en la ficha del producto? */
  is_visible: boolean
  /** ¿Es filtrable? */
  is_filterable: boolean
  /** Orden de visualización */
  sort_order: number
}

/**
 * Imagen de producto
 */
export interface ProductImage {
  /** URL de la imagen */
  url: string
  /** Texto alternativo */
  alt_text?: string
  /** Orden de visualización */
  position: number
  /** Dimensiones (opcional) */
  dimensions?: {
    width: number
    height: number
  }
}

/**
 * Precio con moneda
 */
export interface Price {
  /** Monto */
  amount: number
  /** Código de moneda (ISO 4217) */
  currency: string
  /** ¿Incluye impuestos? */
  includes_tax?: boolean
}

/**
 * Rango de precios
 */
export interface PriceRange {
  /** Precio mínimo */
  min: Price
  /** Precio máximo */
  max: Price
}

/**
 * Opciones de ordenamiento
 */
export interface SortOption {
  /** Campo por el que ordenar */
  field: string
  /** Etiqueta para mostrar */
  label: string
  /** Dirección de ordenamiento por defecto */
  defaultOrder?: 'asc' | 'desc'
}

/**
 * Filtro genérico
 */
export interface FilterOption {
  /** Identificador del filtro */
  id: string
  /** Nombre del filtro */
  name: string
  /** Tipo de filtro */
  type: 'checkbox' | 'radio' | 'range' | 'select'
  /** Opciones del filtro */
  options: Array<{
    value: string
    label: string
    count?: number
  }>
}

/**
 * Resultado de búsqueda
 */
export interface SearchResult<T> {
  /** Elementos encontrados */
  items: T[]
  /** Total de elementos */
  total: number
  /** Página actual */
  page: number
  /** Límite por página */
  limit: number
  /** Total de páginas */
  total_pages: number
  /** Filtros disponibles */
  filters?: FilterOption[]
  /** Ordenamientos disponibles */
  sort_options?: SortOption[]
}
