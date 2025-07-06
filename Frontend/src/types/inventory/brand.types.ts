/**
 * Información adicional de la marca
 */
export interface BrandInfo {
  /** Título descriptivo de la marca */
  titulo?: string
  /** URL relacionada con la marca */
  url?: string
  /** Descripción detallada de la marca */
  descripcion?: string
}

/**
 * Interfaz que representa una marca de producto
 */
export interface Brand {
  /** Identificador único de la marca */
  uuid: string
  /** Nombre de la marca */
  name: string
  /** Descripción opcional de la marca */
  description?: string
  /** Información adicional de la marca */
  informacion?: BrandInfo
  /** Indica si la marca está activa */
  is_active: boolean
  /** Fecha de creación */
  created_at: string | Date
  /** Fecha de última actualización */
  updated_at: string | Date
}

/**
 * Datos necesarios para crear una nueva marca
 */
export type CreateBrandDto = Omit<Brand, 'uuid' | 'created_at' | 'updated_at' | 'is_active'> & {
  is_active?: boolean
}

/**
 * Datos necesarios para actualizar una marca existente
 */
export type UpdateBrandDto = Partial<CreateBrandDto>

/**
 * Filtros para consultar marcas
 */
export interface BrandFilters {
  /** Texto para búsqueda por nombre o descripción */
  search?: string
  /** Filtrar por estado activo/inactivo */
  is_active?: boolean
  /** Ordenar por campo específico */
  sortBy?: 'name' | 'created_at' | 'updated_at'
  /** Orden ascendente o descendente */
  sortOrder?: 'asc' | 'desc'
}
