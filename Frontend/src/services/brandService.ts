import axios from 'axios'
import axiosInstance from '../config/axios'
import type { Brand, BrandFilters, CreateBrandDto, UpdateBrandDto } from '../types/inventory/brand.types'

const BASE_URL = '/brands'
const DEBUG = import.meta.env.DEV // Habilitar solo en desarrollo

/**
 * Obtener todas las marcas
 */
export const getBrands = async (filters?: BrandFilters): Promise<Brand[]> => {
  if (DEBUG) {
    console.log('📡 [brandService] getBrands - Solicitando marcas con filtros:', filters)
  }
  
  try {
    const response = await axiosInstance.get(BASE_URL, { params: filters })
    
    if (DEBUG) {
      console.log('✅ [brandService] getBrands - Respuesta recibida:', {
        count: response.data.data?.length || 0,
        data: response.data.data
      })
    }
    
    return response.data.data || []
  } catch (error) {
    const errorMessage = '❌ [brandService] getBrands - Error al obtener marcas'
    console.error(errorMessage, error)
    console.error('Detalles del error:', {
      status: axios.isAxiosError(error) ? error.response?.status : 'N/A',
      message: axios.isAxiosError(error) ? error.message : 'Error desconocido'
    })
    throw handleApiError(error)
  }
}

/**
 * Obtener una marca por ID
 */
export const getBrandById = async (id: string): Promise<Brand | null> => {
  if (DEBUG) {
    console.log(`📡 [brandService] getBrandById - Solicitando marca con ID: ${id}`)
  }
  
  try {
    const response = await axiosInstance.get(`${BASE_URL}/${id}`)
    
    if (DEBUG) {
      console.log(`✅ [brandService] getBrandById - Marca ${id} encontrada:`, response.data.data)
    }
    
    return response.data.data || null
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      if (DEBUG) {
        console.log(`ℹ️ [brandService] getBrandById - Marca ${id} no encontrada`)
      }
      return null
    }
    
    const errorMessage = `❌ [brandService] getBrandById - Error al obtener marca ${id}`
    console.error(errorMessage, error)
    throw handleApiError(error)
  }
}

/**
 * Crear una nueva marca
 */
export const createBrand = async (brandData: CreateBrandDto): Promise<Brand> => {
  if (DEBUG) {
    console.log('➕ [brandService] createBrand - Creando nueva marca con datos:', brandData)
  }
  
  try {
    const response = await axiosInstance.post(BASE_URL, brandData)
    
    if (DEBUG) {
      console.log('✅ [brandService] createBrand - Marca creada exitosamente:', response.data.data)
    }
    
    return response.data.data
  } catch (error) {
    const errorMessage = '❌ [brandService] createBrand - Error al crear marca'
    console.error(errorMessage, error)
    console.error('Datos de la solicitud fallida:', brandData)
    throw handleApiError(error)
  }
}

/**
 * Actualizar una marca existente
 */
export const updateBrand = async (
  id: string,
  brandData: UpdateBrandDto
): Promise<Brand> => {
  if (DEBUG) {
    console.log(`🔄 [brandService] updateBrand - Actualizando marca ${id} con datos:`, brandData)
  }
  
  try {
    const response = await axiosInstance.put(`${BASE_URL}/${id}`, brandData)
    
    if (DEBUG) {
      console.log(`✅ [brandService] updateBrand - Marca ${id} actualizada:`, response.data.data)
    }
    
    return response.data.data
  } catch (error) {
    const errorMessage = `❌ [brandService] updateBrand - Error al actualizar marca ${id}`
    console.error(errorMessage, error)
    console.error('Datos de la solicitud fallida:', brandData)
    throw handleApiError(error)
  }
}

/**
 * Eliminar una marca (soft delete)
 */
export const deleteBrand = async (id: string): Promise<boolean> => {
  if (DEBUG) {
    console.log(`🗑️ [brandService] deleteBrand - Solicitando eliminación de marca ${id}`)
  }
  
  try {
    await axiosInstance.delete(`${BASE_URL}/${id}`)
    
    if (DEBUG) {
      console.log(`✅ [brandService] deleteBrand - Marca ${id} eliminada exitosamente`)
    }
    
    return true
  } catch (error) {
    const errorMessage = `❌ [brandService] deleteBrand - Error al eliminar marca ${id}`
    console.error(errorMessage, error)
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
      console.error('🔍 [brandService] Detalles del error de API:', errorDetails)
    }
  } else if (error instanceof Error) {
    errorMessage = error.message
    errorDetails = { stack: error.stack }
  }
  
  const finalError = new Error(`[brandService] ${errorMessage}`)
  if (DEBUG) {
    console.error('📌 [brandService] Error final:', finalError)
  }
  
  return finalError
}
