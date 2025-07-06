import axios from 'axios'
import axiosInstance from '../config/axios'
import type { Category, CategoryTreeNode, CreateCategoryDto, UpdateCategoryDto, CategoryFilters } from '../types/inventory/category.types'

const BASE_URL = '/categories'
const DEBUG = import.meta.env.DEV // Habilitar solo en desarrollo

/**
 * Obtener todas las categorías
 */
export const getCategories = async (filters?: CategoryFilters): Promise<Category[]> => {
  if (DEBUG) {
    console.log('📡 [categoryService] getCategories - Solicitando categorías con filtros:', filters)
  }
  
  try {
    const response = await axiosInstance.get(BASE_URL, { params: filters })
    
    if (DEBUG) {
      console.log('✅ [categoryService] getCategories - Respuesta recibida:', {
        count: response.data.data?.length || 0,
        data: response.data.data
      })
    }
    
    return response.data.data || []
  } catch (error) {
    const errorMessage = '❌ [categoryService] getCategories - Error al obtener categorías'
    console.error(errorMessage, error)
    throw handleApiError(error)
  }
}

/**
 * Obtener el árbol completo de categorías
 */
export const getCategoryTree = async (): Promise<CategoryTreeNode[]> => {
  if (DEBUG) {
    console.log('🌳 [categoryService] getCategoryTree - Solicitando árbol de categorías')
  }
  
  try {
    const response = await axiosInstance.get(`${BASE_URL}/tree`)
    
    if (DEBUG) {
      console.log('✅ [categoryService] getCategoryTree - Árbol recibido:', {
        count: response.data.data?.length || 0,
        levels: getTreeDepth(response.data.data || [])
      })
    }
    
    return response.data.data || []
  } catch (error) {
    const errorMessage = '❌ [categoryService] getCategoryTree - Error al obtener el árbol de categorías'
    console.error(errorMessage, error)
    throw handleApiError(error)
  }
}

// Función auxiliar para calcular la profundidad del árbol
const getTreeDepth = (nodes: CategoryTreeNode[], depth = 0): number => {
  if (!nodes || nodes.length === 0) return depth
  const childDepths = nodes.map(node => getTreeDepth(node.children || [], depth + 1))
  return Math.max(depth, ...childDepths)
}

/**
 * Obtener una categoría por ID
 */
export const getCategoryById = async (id: string): Promise<Category | null> => {
  if (DEBUG) {
    console.log(`📡 [categoryService] getCategoryById - Solicitando categoría con ID: ${id}`)
  }
  
  try {
    const response = await axiosInstance.get(`${BASE_URL}/${id}`)
    
    if (DEBUG) {
      console.log(`✅ [categoryService] getCategoryById - Categoría ${id} encontrada:`, response.data.data)
    }
    
    return response.data.data || null
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      if (DEBUG) {
        console.log(`ℹ️ [categoryService] getCategoryById - Categoría ${id} no encontrada`)
      }
      return null
    }
    
    const errorMessage = `❌ [categoryService] getCategoryById - Error al obtener categoría ${id}`
    console.error(errorMessage, error)
    throw handleApiError(error)
  }
}

/**
 * Crear una nueva categoría
 */
export const createCategory = async (categoryData: CreateCategoryDto): Promise<Category> => {
  if (DEBUG) {
    console.log('➕ [categoryService] createCategory - Creando nueva categoría con datos:', categoryData)
  }
  
  try {
    const response = await axiosInstance.post(BASE_URL, categoryData)
    
    if (DEBUG) {
      console.log('✅ [categoryService] createCategory - Categoría creada exitosamente:', response.data.data)
    }
    
    return response.data.data
  } catch (error) {
    const errorMessage = '❌ [categoryService] createCategory - Error al crear categoría'
    console.error(errorMessage, error)
    console.error('Datos de la solicitud fallida:', categoryData)
    throw handleApiError(error)
  }
}

/**
 * Actualizar una categoría existente
 */
export const updateCategory = async (
  id: string,
  categoryData: UpdateCategoryDto
): Promise<Category> => {
  if (DEBUG) {
    console.log(`🔄 [categoryService] updateCategory - Actualizando categoría ${id} con datos:`, categoryData)
  }
  
  try {
    const response = await axiosInstance.put(`${BASE_URL}/${id}`, categoryData)
    
    if (DEBUG) {
      console.log(`✅ [categoryService] updateCategory - Categoría ${id} actualizada:`, response.data.data)
    }
    
    return response.data.data
  } catch (error) {
    const errorMessage = `❌ [categoryService] updateCategory - Error al actualizar categoría ${id}`
    console.error(errorMessage, error)
    console.error('Datos de la solicitud fallida:', categoryData)
    throw handleApiError(error)
  }
}

/**
 * Eliminar una categoría (soft delete)
 */
export const deleteCategory = async (id: string): Promise<boolean> => {
  if (DEBUG) {
    console.log(`🗑️ [categoryService] deleteCategory - Solicitando eliminación de categoría ${id}`)
  }
  
  try {
    await axiosInstance.delete(`${BASE_URL}/${id}`)
    
    if (DEBUG) {
      console.log(`✅ [categoryService] deleteCategory - Categoría ${id} eliminada exitosamente`)
    }
    
    return true
  } catch (error) {
    const errorMessage = `❌ [categoryService] deleteCategory - Error al eliminar categoría ${id}`
    console.error(errorMessage, error)
    
    // Verificar si el error es porque la categoría tiene productos asociados
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      const errorData = error.response.data as { message?: string; details?: string }
      if (errorData.details?.includes('tiene productos asociados')) {
        console.error('ℹ️ [categoryService] deleteCategory - No se puede eliminar: La categoría tiene productos asociados')
      }
    }
    
    throw handleApiError(error)
  }
}

/**
 * Mover una categoría a otro padre
 */
export const moveCategory = async (
  id: string,
  parentId: string | null
): Promise<Category> => {
  if (DEBUG) {
    console.log(`🔄 [categoryService] moveCategory - Moviendo categoría ${id} al padre:`, parentId || 'raíz')
  }
  
  try {
    const response = await axiosInstance.patch(`${BASE_URL}/${id}/move`, { parentId })
    
    if (DEBUG) {
      console.log(`✅ [categoryService] moveCategory - Categoría ${id} movida exitosamente a padre:`, 
        parentId || 'raíz')
    }
    
    return response.data.data
  } catch (error) {
    const errorMessage = `❌ [categoryService] moveCategory - Error al mover categoría ${id}`
    console.error(errorMessage, error)
    
    // Manejar errores específicos de movimiento
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      const errorData = error.response.data as { message?: string; details?: string }
      if (errorData.details?.includes('no puede ser padre de sí misma')) {
        console.error('ℹ️ [categoryService] moveCategory - No se puede mover una categoría dentro de sí misma')
      } else if (errorData.details?.includes('crearía un bucle en el árbol')) {
        console.error('ℹ️ [categoryService] moveCategory - No se puede crear un bucle en la jerarquía de categorías')
      }
    }
    
    throw handleApiError(error)
  }
}

/**
 * Manejador de errores para las peticiones a la API
 */
const handleApiError = (error: unknown): Error => {
  let errorMessage = 'Error desconocido'
  let errorDetails: {
    status?: number
    statusText?: string
    url?: string
    method?: string
    data?: unknown
    responseData?: unknown
    stack?: string
  } = {}

  if (axios.isAxiosError(error)) {
    const response = error.response
    errorMessage = response?.data?.message || error.message || 'Error en la petición'
    
    errorDetails = {
      status: response?.status,
      statusText: response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      data: error.config?.data,
      responseData: response?.data
    }
    
    if (DEBUG) {
      console.error('🔍 [categoryService] Detalles del error de API:', errorDetails)
    }
  } else if (error instanceof Error) {
    errorMessage = error.message
    errorDetails = { stack: error.stack }
  }
  
  const finalError = new Error(`[categoryService] ${errorMessage}`)
  if (DEBUG) {
    console.error('📌 [categoryService] Error final:', finalError)
  }
  
  return finalError
}
