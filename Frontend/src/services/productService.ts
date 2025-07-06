import axios from 'axios'
import axiosInstance from '../config/axios'
import type {
  Product,
  ProductListItem,
  CreateProductDto,
  UpdateProductDto,
  ProductFilters,
  ProductVariant
} from '../types/inventory/product.types'

const BASE_URL = '/products'
const DEBUG = import.meta.env.DEV // Habilitar solo en desarrollo

/**
 * Obtener lista de productos con paginación
 */
export const getProducts = async (filters?: ProductFilters): Promise<{
  products: ProductListItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}> => {
  if (DEBUG) {
    console.log('📡 [productService] getProducts - Solicitando productos con filtros:', filters)
  }
  
  try {
    const response = await axiosInstance.get(BASE_URL, { params: filters })
    
    const result = {
      products: response.data.data || [],
      total: response.data.pagination?.total || 0,
      page: response.data.pagination?.page || 1,
      limit: response.data.pagination?.limit || 10,
      totalPages: response.data.pagination?.totalPages || 1
    }
    
    if (DEBUG) {
      console.log('✅ [productService] getProducts - Respuesta recibida:', {
        count: result.products.length,
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
        filtrosUsados: filters
      })
    }
    
    return result
  } catch (error) {
    const errorMessage = '❌ [productService] getProducts - Error al obtener productos'
    console.error(errorMessage, error)
    throw handleApiError(error)
  }
}

/**
 * Obtener un producto por ID
 */
export const getProductById = async (id: string): Promise<Product | null> => {
  if (DEBUG) {
    console.log(`📡 [productService] getProductById - Solicitando producto con ID: ${id}`)
  }
  
  try {
    const response = await axiosInstance.get(`${BASE_URL}/${id}`)
    
    if (DEBUG) {
      const product = response.data.data as Product | null
      console.log(`✅ [productService] getProductById - Producto ${id} encontrado:`, {
        nombre: product?.name,
        sku: product?.sku,
        stock: product?.stock_quantity,
        estado: product?.status
      })
    }
    
    return response.data.data || null
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      if (DEBUG) {
        console.log(`ℹ️ [productService] getProductById - Producto ${id} no encontrado`)
      }
      return null
    }
    
    const errorMessage = `❌ [productService] getProductById - Error al obtener producto ${id}`
    console.error(errorMessage, error)
    throw handleApiError(error)
  }
}

/**
 * Crear un nuevo producto
 */
export const createProduct = async (productData: CreateProductDto): Promise<Product> => {
  if (DEBUG) {
    console.log('➕ [productService] createProduct - Creando nuevo producto con datos:', {
      ...productData,
      // Ocultar datos binarios grandes en el log
      images: productData.images?.length ? `[${productData.images.length} imágenes]` : 'Sin imágenes',
      description: productData.description ? `[${productData.description.length} caracteres]` : 'Sin descripción'
    })
  }
  
  try {
    // Convertir campos de tipo Date a string ISO si es necesario
    const formattedData = {
      ...productData,
      sale_start_date: productData.sale_start_date ? new Date(productData.sale_start_date).toISOString() : undefined,
      sale_end_date: productData.sale_end_date ? new Date(productData.sale_end_date).toISOString() : undefined,
      published_at: productData.published_at ? new Date(productData.published_at).toISOString() : undefined
    }

    const response = await axiosInstance.post(BASE_URL, formattedData)
    
    if (DEBUG) {
      const createdProduct = response.data.data as Product
      console.log('✅ [productService] createProduct - Producto creado exitosamente:', {
        id: createdProduct.uuid,
        sku: createdProduct.sku,
        nombre: createdProduct.name,
        categorias: createdProduct.categories?.map(c => c.name).join(', ') || 'Sin categorías'
      })
    }
    
    return response.data.data
  } catch (error) {
    const errorMessage = '❌ [productService] createProduct - Error al crear producto'
    console.error(errorMessage, error)
    
    // Log detallado de errores de validación
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      console.error('⚠️ [productService] Errores de validación:', error.response.data?.errors || error.response.data)
    }
    
    throw handleApiError(error)
  }
}

/**
 * Actualizar un producto existente
 */
export const updateProduct = async (
  id: string,
  productData: UpdateProductDto
): Promise<Product> => {
  if (DEBUG) {
    console.log(`🔄 [productService] updateProduct - Actualizando producto ${id} con datos:`, {
      ...productData,
      // Ocultar datos binarios grandes en el log
      images: productData.images ? `[${productData.images.length} imágenes]` : 'Sin cambios en imágenes',
      description: productData.description ? `[${productData.description?.length || 0} caracteres]` : 'Sin cambios en descripción'
    })
  }
  
  try {
    // Convertir campos de tipo Date a string ISO si es necesario
    const formattedData = {
      ...productData,
      sale_start_date: productData.sale_start_date ? new Date(productData.sale_start_date).toISOString() : undefined,
      sale_end_date: productData.sale_end_date ? new Date(productData.sale_end_date).toISOString() : undefined,
      published_at: productData.published_at ? new Date(productData.published_at).toISOString() : undefined
    }

    const response = await axiosInstance.put(`${BASE_URL}/${id}`, formattedData)
    
    if (DEBUG) {
      console.log(`✅ [productService] updateProduct - Producto ${id} actualizado exitosamente`)
    }
    
    return response.data.data
  } catch (error) {
    const errorMessage = `❌ [productService] updateProduct - Error al actualizar producto ${id}`
    console.error(errorMessage, error)
    
    // Log detallado de errores de validación
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      console.error('⚠️ [productService] Errores de validación:', error.response.data?.errors || error.response.data)
    }
    
    throw handleApiError(error)
  }
}

/**
 * Eliminar un producto (soft delete)
 */
export const deleteProduct = async (id: string): Promise<boolean> => {
  if (DEBUG) {
    console.log(`🗑️ [productService] deleteProduct - Solicitando eliminación de producto ${id}`)
  }
  
  try {
    await axiosInstance.delete(`${BASE_URL}/${id}`)
    
    if (DEBUG) {
      console.log(`✅ [productService] deleteProduct - Producto ${id} eliminado exitosamente`)
    }
    
    return true
  } catch (error) {
    const errorMessage = `❌ [productService] deleteProduct - Error al eliminar producto ${id}`
    console.error(errorMessage, error)
    
    // Manejar errores específicos
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        console.error('⚠️ [productService] No se puede eliminar el producto:', 
          error.response.data?.message || 'Tiene registros asociados')
      } else if (error.response?.status === 404) {
        console.error('⚠️ [productService] El producto no existe o ya fue eliminado')
      }
    }
    
    throw handleApiError(error)
  }
}

/**
 * Actualizar inventario de un producto
 */
export const updateProductInventory = async (
  id: string,
  quantity: number,
  action: 'add' | 'subtract' | 'set' = 'set'
): Promise<Product> => {
  if (DEBUG) {
    console.log(`📦 [productService] updateProductInventory - Actualizando inventario para producto ${id}:`, 
      `${action} ${quantity} unidades`)
  }
  
  try {
    const response = await axiosInstance.patch(`${BASE_URL}/${id}/inventory`, {
      quantity,
      action
    })
    
    const updatedProduct = response.data.data as Product
    
    if (DEBUG) {
      console.log(`✅ [productService] updateProductInventory - Inventario actualizado:`, {
        producto: updatedProduct.name,
        stockAnterior: updatedProduct.stock_quantity - (action === 'add' ? quantity : action === 'subtract' ? -quantity : 0),
        stockNuevo: updatedProduct.stock_quantity,
        estado: updatedProduct.status
      })
    }
    
    return updatedProduct
  } catch (error) {
    const errorMessage = `❌ [productService] updateProductInventory - Error al actualizar inventario del producto ${id}`
    console.error(errorMessage, error)
    
    // Manejar errores específicos de inventario
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      const errorData = error.response.data as { message?: string; details?: string }
      if (errorData.details?.includes('stock negativo')) {
        console.error('⚠️ [productService] No hay suficiente stock disponible')
      }
    }
    
    throw handleApiError(error)
  }
}

/**
 * Obtener variantes de un producto
 */
export const getProductVariants = async (productId: string): Promise<ProductVariant[]> => {
  if (DEBUG) {
    console.log(`🔄 [productService] getProductVariants - Solicitando variantes para producto ${productId}`)
  }
  
  try {
    const response = await axiosInstance.get(`${BASE_URL}/${productId}/variants`)
    
    if (DEBUG) {
      console.log(`✅ [productService] getProductVariants - Variantes obtenidas:`, {
        productoId: productId,
        cantidad: response.data.data?.length || 0
      })
    }
    
    return response.data.data || []
  } catch (error) {
    const errorMessage = `❌ [productService] getProductVariants - Error al obtener variantes del producto ${productId}`
    console.error(errorMessage, error)
    
    // Si el producto no tiene variantes, el backend podría devolver 404
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      if (DEBUG) {
        console.log(`ℹ️ [productService] El producto ${productId} no tiene variantes definidas`)
      }
      return []
    }
    
    throw handleApiError(error)
  }
}

/**
 * Actualizar variantes de un producto
 */
export const updateProductVariants = async (
  productId: string,
  variants: ProductVariant[]
): Promise<ProductVariant[]> => {
  if (DEBUG) {
    console.log(`🔄 [productService] updateProductVariants - Actualizando ${variants.length} variantes para producto ${productId}`)
    
    // Log detallado de las variantes (solo en modo debug)
    variants.forEach((v, i) => {
      console.log(`   Variante ${i + 1}:`, {
        sku: v.sku,
        opciones: v.options.map(o => `${o.name}: ${o.value}`).join(', '),
        stock: v.stock_quantity,
        precio: v.price || 'Usa precio base'
      })
    })
  }
  
  try {
    const response = await axiosInstance.put(
      `${BASE_URL}/${productId}/variants`,
      { variants }
    )
    
    if (DEBUG) {
      console.log(`✅ [productService] updateProductVariants - ${variants.length} variantes actualizadas para producto ${productId}`)
    }
    
    return response.data.data || []
  } catch (error) {
    const errorMessage = `❌ [productService] updateProductVariants - Error al actualizar variantes del producto ${productId}`
    console.error(errorMessage, error)
    
    // Log detallado de errores de validación
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      console.error('⚠️ [productService] Errores de validación en variantes:', 
        error.response.data?.errors || error.response.data)
    }
    
    throw handleApiError(error)
  }
}

/**
 * Buscar productos
 */
export const searchProducts = async (query: string, filters?: Omit<ProductFilters, 'search'>) => {
  if (DEBUG) {
    console.log('🔍 [productService] searchProducts - Buscando productos:', {
      consulta: query,
      filtros: filters
    })
  }
  
  try {
    const response = await axiosInstance.get(`${BASE_URL}/search`, {
      params: { q: query, ...filters }
    })
    
    if (DEBUG) {
      console.log('✅ [productService] searchProducts - Resultados de búsqueda:', {
        consulta: query,
        resultados: response.data.data?.length || 0,
        sugerencias: response.data.suggestions || 'No hay sugerencias'
      })
    }
    
    return response.data.data || []
  } catch (error) {
    const errorMessage = '❌ [productService] searchProducts - Error al buscar productos'
    console.error(errorMessage, error)
    
    // Si la búsqueda no devuelve resultados, el backend podría devolver 404
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      if (DEBUG) {
        console.log('ℹ️ [productService] No se encontraron productos que coincidan con la búsqueda')
      }
      return []
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
      console.error('🔍 [productService] Detalles del error de API:', errorDetails)
    }
  } else if (error instanceof Error) {
    errorMessage = error.message
    errorDetails = { stack: error.stack }
  }
  
  // Mapear códigos de estado HTTP a mensajes más descriptivos
  if (errorDetails.status) {
    const statusMessages: Record<number, string> = {
      400: 'Solicitud incorrecta',
      401: 'No autorizado',
      403: 'Acceso denegado',
      404: 'Recurso no encontrado',
      409: 'Conflicto (posible duplicado)',
      422: 'Error de validación',
      429: 'Demasiadas solicitudes',
      500: 'Error interno del servidor',
      503: 'Servicio no disponible'
    }
    
    const statusMessage = statusMessages[errorDetails.status] || `Error HTTP ${errorDetails.status}`
    errorMessage = `${statusMessage}: ${errorMessage}`
  }
  
  const finalError = new Error(`[productService] ${errorMessage}`)
  
  if (DEBUG) {
    console.error('📌 [productService] Error final:', {
      message: finalError.message,
      ...errorDetails
    })
  }
  
  return finalError
}
