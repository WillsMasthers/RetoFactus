/**
 * Personalización visual de la categoría
 */
export interface CategoryCustomization {
  /** Color asociado a la categoría en formato HEX */
  color?: string
  /** Clase del ícono (ej: 'fa fa-icon') */
  icon?: string
  /** URL de la imagen de la categoría */
  image_url?: string
}

/**
 * Interfaz que representa una categoría de producto
 */
export interface Category {
  /** Identificador único de la categoría */
  uuid: string
  /** Nombre de la categoría */
  name: string
  /** Descripción opcional */
  description?: string
  /** ID de la categoría padre (para jerarquías) */
  parent_id?: string | null
  /** Nivel en la jerarquía (0 para categorías raíz) */
  level: number
  /** Ruta completa en formato /padre/abuelo */
  path: string
  /** Personalización visual */
  customization?: CategoryCustomization
  /** Indica si la categoría está activa */
  is_active: boolean
  /** Fecha de creación */
  created_at: string | Date
  /** Fecha de última actualización */
  updated_at: string | Date
}

/**
 * Datos necesarios para crear una nueva categoría
 */
export type CreateCategoryDto = Omit<Category, 'uuid' | 'created_at' | 'updated_at' | 'level' | 'path'> & {
  parent_id?: string | null
}

/**
 * Datos necesarios para actualizar una categoría existente
 */
export type UpdateCategoryDto = Partial<CreateCategoryDto>

/**
 * Categoría con información de jerarquía para árboles
 */
export interface CategoryTreeNode extends Category {
  /** Categorías hijas */
  children?: CategoryTreeNode[]
  /** Indica si la categoría está expandida en la UI */
  isExpanded?: boolean
}

/**
 * Filtros para consultar categorías
 */
export interface CategoryFilters {
  /** Texto para búsqueda por nombre o descripción */
  search?: string
  /** Filtrar por categorías padre específicas */
  parent_id?: string | null
  /** Incluir categorías inactivas */
  include_inactive?: boolean
  /** Incluir jerarquía completa de categorías */
  include_tree?: boolean
}
