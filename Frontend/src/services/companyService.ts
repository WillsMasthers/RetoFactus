// Importaciones de bibliotecas
import axios, { type AxiosError } from 'axios'
import axiosInstance from '../config/axios'

// Importaciones de tipos
import type {
  Company,
  CompanyFormData,
  AddUserToCompanyData,
  UpdateUserRoleData,
  User,
  CompanyResponse,
  CompaniesResponse,
  UsersResponse,
  ApiResponse
} from '../types.d'

// Los tipos de respuesta de la API están definidos en types.d.ts

/**
 * Obtener todas las empresas del usuario actual
 */
export const getCompanies = async (): Promise<Company[]> => {
  try {
    // console.log('Obteniendo lista de empresas...');
    const response = await axiosInstance.get<CompaniesResponse>('/company')
    // console.log('Respuesta de getCompanies:', response.data);

    // Asegurarse de que siempre devolvamos un array de Company
    if (response.data.success && Array.isArray(response.data.companies)) {
      // console.log('Empresas encontradas:', response.data.companies)
      return response.data.companies
    }

    console.warn('Formato de respuesta inesperado:', response.data)
    return []
  } catch (error) {
    console.error('Error en getCompanies:', error)
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return [] // No hay empresas
    }
    throw handleApiError(error)
  }
}

/**
 * Obtener una empresa por ID
 */
export const getCompanyById = async (id: string): Promise<Company | null> => {
  try {
    const response = await axiosInstance.get<CompanyResponse>(`/company/${id}`)
    return response.data.data || null
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null // Empresa no encontrada
    }
    throw handleApiError(error)
  }
}

/**
 * Crear una nueva empresa
 */
export const createCompany = async (
  companyData: CompanyFormData
): Promise<Company> => {
  try {
    const response = await axiosInstance.post<CompanyResponse>(
      '/company',
      companyData
    )
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error al crear la empresa')
    }
    return response.data.data
  } catch (error) {
    console.error('Error al crear la empresa:', error)
    throw handleApiError(error)
  }
}

/**
 * Actualizar una empresa existente
 */
export const updateCompany = async (
  id: string,
  companyData: Partial<Company>
): Promise<Company> => {
  try {
    console.log('Datos originales recibidos:', companyData)

    const dataToSend = {
      ...companyData,
      billing_configuration: {
        payment_methods:
          companyData.billing_configuration?.payment_methods || [],
        taxes:
          companyData.billing_configuration?.taxes
            ?.map((tax) => {
              // Si es string con formato code-value (ej: '01-19')
              if (typeof tax === 'string') {
                if (tax.includes('-')) return tax
                return tax // Si es solo código, lo mantenemos
              }

              // Si es objeto Tax
              if (tax && typeof tax === 'object') {
                if ('code' in tax) return tax.code
              }

              console.warn('Tax inválido:', tax)
              return null
            })
            .filter(Boolean) || []
      }
    }

    console.log('Datos finales a enviar:', dataToSend)

    const response = await axiosInstance.put(`/company/${id}`, dataToSend)

    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al actualizar la empresa')
    }

    return response.data.company
  } catch (error) {
    console.error('Error en updateCompany:', error)
    throw handleApiError(error)
  }
}

/**
 * Eliminar una empresa (soft delete)
 */
export const deleteCompany = async (id: string): Promise<boolean> => {
  try {
    const response = await axiosInstance.delete<ApiResponse<null>>(
      `/company/${id}`
    )
    return response.data.success === true
  } catch (error) {
    console.error('Error al eliminar la empresa:', error)
    throw handleApiError(error)
  }
}

/**
 * Obtener usuarios de una empresa
 */
export const getCompanyUsers = async (companyId: string): Promise<User[]> => {
  try {
    const response = await axiosInstance.get<UsersResponse>(
      `/company/${companyId}/users`
    )
    return response.data.data || []
  } catch (error) {
    console.error('Error al obtener usuarios de la empresa:', error)
    throw handleApiError(error)
  }
}

/**
 * Agregar un usuario a la empresa
 */
export const addUserToCompany = async (
  companyId: string,
  userData: AddUserToCompanyData
): Promise<User> => {
  try {
    const response = await axiosInstance.post<{ success: boolean; user: User }>(
      `/company/${companyId}/users`,
      userData
    )

    if (!response.data.success || !response.data.user) {
      throw new Error('Error al agregar usuario a la empresa')
    }

    return response.data.user
  } catch (error) {
    console.error('Error al agregar usuario a la empresa:', error)
    throw handleApiError(error)
  }
}

/**
 * Eliminar un usuario de la empresa
 */
export const removeUserFromCompany = async (
  companyId: string,
  userId: string
): Promise<boolean> => {
  try {
    const response = await axiosInstance.delete<ApiResponse<null>>(
      `/company/${companyId}/users/${userId}`
    )
    return response.data.success === true
  } catch (error) {
    console.error('Error al eliminar usuario de la empresa:', error)
    throw handleApiError(error)
  }
}

/**
 * Actualizar el rol de un usuario en la empresa
 */
export const updateUserRole = async (
  companyId: string,
  userId: string,
  roleData: UpdateUserRoleData
): Promise<User> => {
  try {
    const response = await axiosInstance.put<{ success: boolean; user: User }>(
      `/company/${companyId}/users/${userId}/role`,
      roleData
    )

    if (!response.data.success || !response.data.user) {
      throw new Error('Error al actualizar el rol del usuario')
    }

    return response.data.user
  } catch (error) {
    console.error('Error al actualizar el rol del usuario:', error)
    throw handleApiError(error)
  }
}

/**
 * Cambiar la empresa actual del usuario
 */
export const switchCurrentCompany = async (
  companyId: string
): Promise<boolean> => {
  try {
    const response = await axiosInstance.post<ApiResponse<null>>(
      '/company/switch',
      { companyId }
    )
    return response.data.success === true
  } catch (error) {
    console.error('Error al cambiar de empresa:', error)
    throw handleApiError(error)
  }
}

/**
 * Manejador de errores para las peticiones a la API
 */
function handleApiError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>

    if (axiosError.response) {
      // La petición se realizó y el servidor respondió con un código de estado
      const status = axiosError.response.status
      const message = axiosError.response.data?.message || axiosError.message

      const errorMessage = `Error ${status}: ${
        message || 'Error en la petición al servidor'
      }`
      const errorWithStatus = new Error(errorMessage) as Error & {
        status?: number
      }
      errorWithStatus.status = status

      // Si hay más detalles en la respuesta, agregarlos al error
      if (axiosError.response.data) {
        Object.assign(errorWithStatus, axiosError.response.data)
      }

      return errorWithStatus
    } else if (axiosError.request) {
      // La petición se realizó pero no se recibió respuesta
      console.error('No se recibió respuesta del servidor:', axiosError.request)
      return new Error(
        'No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet.'
      )
    } else {
      // Error al configurar la petición
      console.error('Error al configurar la petición:', axiosError.message)
      return new Error('Error al procesar la solicitud')
    }
  }

  // Si no es un error de Axios, devolver el error original
  return error instanceof Error ? error : new Error('Error desconocido')
}
