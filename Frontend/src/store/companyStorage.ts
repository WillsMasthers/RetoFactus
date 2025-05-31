/**
 * @file companyStorage.ts
 * @description Store de gestión de empresas y usuarios usando Zustand
 * @version 2.0.0
 * @created 2025-05-21
 * @updated 2025-05-21
 *
 * Este store proporciona un estado global para la gestión de empresas y usuarios
 * con persistencia local y sincronización con la API.
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type {
  Company,
  CompanyFormData,
  User,
  AddUserToCompanyData,
  UpdateUserRoleData
} from '../types.d'
import * as companyService from '../services/companyService'

/**
 * Interfaz que define el estado y las acciones del store de empresas
 */
interface CompanyStore {
  // --- Estado ---
  /** Lista de empresas del usuario */
  empresas: Company[]
  /** Empresa actualmente seleccionada */
  empresaActual: Company | null
  /** Usuarios de la empresa actual */
  usuariosEmpresa: User[]
  /** Indica si hay una operación en curso */
  cargando: boolean
  /** Mensaje de error, si existe */
  error: string | null
  /** Estado de caché */
  _cache: {
    lastFetched: number | null
    cacheDuration: number
    empresasFetched: boolean
  }

  // --- Acciones de empresas ---
  /**
   * Obtiene todas las empresas del usuario
   * @throws {Error} Si ocurre un error al cargar las empresas
   */
  obtenerEmpresas: () => Promise<void>

  /**
   * Obtiene una empresa por su ID
   * @param id - ID de la empresa a obtener
   * @returns La empresa encontrada o null si no existe
   * @throws {Error} Si ocurre un error al cargar la empresa
   */
  obtenerEmpresaPorId: (id: string) => Promise<Company | null>

  /**
   * Crea una nueva empresa
   * @param datos - Datos de la empresa a crear
   * @returns La empresa creada
   * @throws {Error} Si ocurre un error al crear la empresa
   */
  crearEmpresa: (datos: CompanyFormData) => Promise<Company>

  /**
   * Actualiza una empresa existente
   * @param id - ID de la empresa a actualizar
   * @param datos - Datos a actualizar
   * @returns La empresa actualizada
   * @throws {Error} Si ocurre un error al actualizar la empresa
   */
  actualizarEmpresa: (id: string, datos: Partial<Company>) => Promise<Company>

  /**
   * Elimina una empresa (borrado lógico)
   * @param id - ID de la empresa a eliminar
   * @returns true si la eliminación fue exitosa
   * @throws {Error} Si ocurre un error al eliminar la empresa
   */
  eliminarEmpresa: (id: string) => Promise<boolean>

  // --- Gestión de usuarios ---
  /**
   * Obtiene los usuarios de una empresa
   * @param idEmpresa - ID de la empresa
   * @throws {Error} Si ocurre un error al cargar los usuarios
   */
  obtenerUsuariosEmpresa: (idEmpresa: string) => Promise<void>

  /**
   * Agrega un usuario a una empresa
   * @param idEmpresa - ID de la empresa
   * @param datosUsuario - Datos del usuario a agregar
   * @returns El usuario agregado
   * @throws {Error} Si ocurre un error al agregar el usuario
   */
  agregarUsuario: (
    idEmpresa: string,
    datosUsuario: AddUserToCompanyData
  ) => Promise<User>

  /**
   * Elimina un usuario de una empresa
   * @param idEmpresa - ID de la empresa
   * @param idUsuario - ID del usuario a eliminar
   * @returns true si la eliminación fue exitosa
   * @throws {Error} Si ocurre un error al eliminar el usuario
   */
  eliminarUsuario: (idEmpresa: string, idUsuario: string) => Promise<boolean>

  /**
   * Actualiza el rol de un usuario en una empresa
   * @param idEmpresa - ID de la empresa
   * @param idUsuario - ID del usuario a actualizar
   * @param datosRol - Nuevos datos del rol
   * @returns El usuario actualizado
   * @throws {Error} Si ocurre un error al actualizar el rol
   */
  actualizarRolUsuario: (
    idEmpresa: string,
    idUsuario: string,
    datosRol: UpdateUserRoleData
  ) => Promise<User>

  // --- Utilidades ---
  /**
   * Establece la empresa actual
   * @param empresa - Empresa a establecer como actual o null para limpiar
   */
  establecerEmpresaActual: (empresa: Company | null) => void

  /**
   * Cambia la empresa actual por su ID
   * @param idEmpresa - ID de la empresa a establecer como actual
   * @returns true si el cambio fue exitoso
   * @throws {Error} Si ocurre un error al cambiar de empresa
   */
  cambiarEmpresaActual: (idEmpresa: string) => Promise<boolean>

  /**
   * Limpia el mensaje de error
   */
  limpiarError: () => void
}

// Crear el hook principal
export const useAlmacenEmpresas = create<CompanyStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Estado inicial
        empresas: [],
        empresaActual: null,
        usuariosEmpresa: [],
        cargando: false,
        error: null,
        // Tiempo de caché por defecto: 30 minutos
        _cache: {
          lastFetched: null as number | null,
          cacheDuration: 30 * 60 * 1000, // 30 minutos
          empresasFetched: false
        },

        // Implementación de las acciones
        obtenerEmpresas: async (force = false) => {
          try {
            // console.log('1. Iniciando obtenerEmpresas')
            const response = await companyService.getCompanies()
            // console.log('2. Respuesta del backend:', response)

            if (Array.isArray(response) && response.length > 0) {
              // console.log('3. Estableciendo empresa actual:', response[0])
              set({ empresaActual: response[0] })
            }
          } catch (error) {
            console.error('Error en obtenerEmpresas:', error)
          }
        },

        obtenerEmpresaPorId: async (id: string) => {
          set({ cargando: true, error: null })
          try {
            const empresa = await companyService.getCompanyById(id)
            if (empresa) {
              set({ empresaActual: empresa })
            }
            set({ cargando: false })
            return empresa
          } catch (error) {
            const mensajeError =
              error instanceof Error
                ? error.message
                : 'Error al cargar la empresa'
            set({ error: mensajeError, cargando: false })
            throw new Error(mensajeError)
          }
        },

        crearEmpresa: async (datos: CompanyFormData) => {
          set({ cargando: true, error: null })
          try {
            const nuevaEmpresa = await companyService.createCompany(datos)
            set((estado) => ({
              empresas: [...estado.empresas, nuevaEmpresa],
              empresaActual: nuevaEmpresa,
              cargando: false
            }))
            return nuevaEmpresa
          } catch (error) {
            const mensajeError =
              error instanceof Error
                ? error.message
                : 'Error al crear la empresa'
            set({ error: mensajeError, cargando: false })
            throw new Error(mensajeError)
          }
        },

        actualizarEmpresa: async (id: string, datos: Partial<Company>) => {
          set({ cargando: true, error: null })
          try {
            console.log('Datos antes de actualizar:', { id, datos })

            // Transformar los datos manteniendo los valores existentes
            const datosFormateados = {
              identification: datos.identification || {
                nit: datos.nit,
                dv: datos.dv,
                document_type: datos.document_type
              },
              name: datos.name || {
                company: datos.razon_social,
                commercial: datos.nombre_comercial,
                graphic_representation: datos.nombre_comercial,
                registration: datos.name?.registration
              },
              contact: datos.contact || {
                email: datos.email,
                phone: datos.telefono
              },
              location: datos.location || {
                country: datos.pais,
                department: datos.departamento,
                municipality: datos.ciudad,
                address: datos.direccion,
                postal_code: datos.codigo_postal
              },
              logo: datos.logo || {
                url: datos.url_logo
              },
              billing_configuration: {
                payment_methods:
                  datos.billing_configuration?.payment_methods || [],
                taxes: datos.billing_configuration?.taxes || []
              }
            }

            console.log('Datos formateados:', datosFormateados)
            const empresaActualizada = await companyService.updateCompany(
              id,
              datosFormateados
            )

            set((state) => ({
              empresas: state.empresas.map((emp) =>
                emp._id === id ? empresaActualizada : emp
              ),
              empresaActual: empresaActualizada,
              cargando: false
            }))

            return empresaActualizada
          } catch (error) {
            console.error('Error en actualizarEmpresa:', error)
            const mensajeError =
              error instanceof Error
                ? error.message
                : 'Error al actualizar la empresa'
            set({ error: mensajeError, cargando: false })
            throw new Error(mensajeError)
          }
        },

        eliminarEmpresa: async (id: string) => {
          set({ cargando: true, error: null })
          try {
            const exito = await companyService.deleteCompany(id)
            if (exito) {
              set((estado) => ({
                empresas: estado.empresas.filter(
                  (empresa) => empresa.nit !== id
                ),
                empresaActual:
                  estado.empresaActual?.nit === id
                    ? null
                    : estado.empresaActual,
                cargando: false
              }))
            }
            return exito
          } catch (error) {
            const mensajeError =
              error instanceof Error
                ? error.message
                : 'Error al eliminar la empresa'
            set({ error: mensajeError, cargando: false })
            throw new Error(mensajeError)
          }
        },

        obtenerUsuariosEmpresa: async (idEmpresa: string) => {
          set({ cargando: true, error: null })
          try {
            const usuarios = await companyService.getCompanyUsers(idEmpresa)
            set({ usuariosEmpresa: usuarios, cargando: false })
          } catch (error) {
            const mensajeError =
              error instanceof Error
                ? error.message
                : 'Error al cargar los usuarios de la empresa'
            set({ error: mensajeError, cargando: false })
            throw new Error(mensajeError)
          }
        },

        agregarUsuario: async (
          idEmpresa: string,
          datosUsuario: AddUserToCompanyData
        ) => {
          set({ cargando: true, error: null })
          try {
            const usuario = await companyService.addUserToCompany(
              idEmpresa,
              datosUsuario
            )
            set((estado) => ({
              usuariosEmpresa: [...estado.usuariosEmpresa, usuario],
              cargando: false
            }))
            return usuario
          } catch (error) {
            const mensajeError =
              error instanceof Error
                ? error.message
                : 'Error al agregar el usuario a la empresa'
            set({ error: mensajeError, cargando: false })
            throw new Error(mensajeError)
          }
        },

        eliminarUsuario: async (idEmpresa: string, idUsuario: string) => {
          set({ cargando: true, error: null })
          try {
            const exito = await companyService.removeUserFromCompany(
              idEmpresa,
              idUsuario
            )
            if (exito) {
              set((estado) => ({
                usuariosEmpresa: estado.usuariosEmpresa.filter(
                  (usuario) => usuario._id !== idUsuario
                ),
                cargando: false
              }))
            }
            return exito
          } catch (error) {
            const mensajeError =
              error instanceof Error
                ? error.message
                : 'Error al eliminar el usuario de la empresa'
            set({ error: mensajeError, cargando: false })
            throw new Error(mensajeError)
          }
        },

        actualizarRolUsuario: async (
          idEmpresa: string,
          idUsuario: string,
          datosRol: UpdateUserRoleData
        ) => {
          set({ cargando: true, error: null })
          try {
            const usuarioActualizado = await companyService.updateUserRole(
              idEmpresa,
              idUsuario,
              datosRol
            )
            set((estado) => ({
              usuariosEmpresa: estado.usuariosEmpresa.map((usuario) =>
                usuario._id === idUsuario ? usuarioActualizado : usuario
              ),
              cargando: false
            }))
            return usuarioActualizado
          } catch (error) {
            const mensajeError =
              error instanceof Error
                ? error.message
                : 'Error al actualizar el rol del usuario'
            set({ error: mensajeError, cargando: false })
            throw new Error(mensajeError)
          }
        },

        establecerEmpresaActual: (empresa: Company | null) => {
          // Solo actualizar si realmente ha cambiado
          set((state) => {
            if (state.empresaActual?.nit === empresa?.nit) return state
            return { empresaActual: empresa }
          })
        },

        cambiarEmpresaActual: async (idEmpresa: string) => {
          set({ cargando: true, error: null })
          try {
            const exito = await companyService.switchCurrentCompany(idEmpresa)
            if (exito) {
              const empresa = await companyService.getCompanyById(idEmpresa)
              if (empresa) {
                set({ empresaActual: empresa })
              }
            }
            set({ cargando: false })
            return exito
          } catch (error) {
            const mensajeError =
              error instanceof Error
                ? error.message
                : 'Error al cambiar de empresa'
            set({ error: mensajeError, cargando: false })
            throw new Error(mensajeError)
          }
        },

        limpiarError: () => set({ error: null })
      }),
      {
        name: 'almacen-empresas',
        partialize: (state: CompanyStore) => ({
          empresas: state.empresas,
          empresaActual: state.empresaActual,
          usuariosEmpresa: state.usuariosEmpresa
        })
      }
    )
  )
)

export const useCompanyStorage = useAlmacenEmpresas
