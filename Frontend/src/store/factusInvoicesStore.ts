/**
 * @file factusInvoicesStore.ts
 * @description Store para gestionar el estado de las facturas de Factus usando Zustand
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import {
  factusInvoicesService,
  type FactusInvoiceFilters,
  type FactusInvoice
} from '../services/factusInvoicesService'

interface FactusInvoicesState {
  invoices: FactusInvoice[]
  isLoading: boolean
  error: string | null
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
  filters: FactusInvoiceFilters
  currentInvoice: any | null

  // Acciones
  fetchInvoices: (filters?: FactusInvoiceFilters) => Promise<void>
  setFilters: (filters: Partial<FactusInvoiceFilters>) => void
  clearFilters: () => void
  changePage: (page: number) => void
  clearError: () => void
  fetchInvoiceDetails: (invoiceNumber: string) => Promise<void>
  clearCurrentInvoice: () => void
  downloadInvoicePDF: (number: string) => Promise<void>
  downloadInvoiceXML: (number: string) => Promise<void>
}

const DEFAULT_PAGINATION = {
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 10
}

const DEFAULT_FILTERS: FactusInvoiceFilters = {
  status: 1,
  page: 1
}

type SetState = (
  partial:
    | FactusInvoicesState
    | Partial<FactusInvoicesState>
    | ((
        state: FactusInvoicesState
      ) => FactusInvoicesState | Partial<FactusInvoicesState>),
  replace?: boolean | undefined
) => void

type GetState = () => FactusInvoicesState

const fetchInvoicesAction = async (
  set: SetState,
  get: GetState,
  filters?: FactusInvoiceFilters
) => {
  try {
    set({ isLoading: true, error: null })
    const currentFilters = filters || get().filters
    const response = await factusInvoicesService.getFactusInvoices(
      currentFilters
    )

    if (!response?.data) {
      throw new Error('No se recibieron datos del servidor')
    }

    set({
      invoices: response.data.data || [],
      pagination: response.data.pagination
        ? {
            currentPage: response.data.pagination.current_page,
            totalPages: response.data.pagination.last_page,
            totalItems: response.data.pagination.total,
            itemsPerPage: response.data.pagination.per_page
          }
        : DEFAULT_PAGINATION,
      filters: currentFilters
    })
  } catch (error) {
    set({
      invoices: [],
      pagination: DEFAULT_PAGINATION,
      error:
        error instanceof Error ? error.message : 'Error al obtener facturas'
    })
  } finally {
    set({ isLoading: false })
  }
}

// Memoizamos la función fetchInvoices para evitar recreaciones
const memoizedFetchInvoices = (set: SetState, get: GetState) => {
  let lastFetch: Promise<void> | null = null
  return async (filters?: FactusInvoiceFilters) => {
    if (lastFetch) {
      await lastFetch
    }
    lastFetch = fetchInvoicesAction(set, get, filters)
    await lastFetch
    lastFetch = null
  }
}

const fetchInvoiceDetailsAction = async (
  set: SetState,
  get: GetState,
  invoiceNumber: string
) => {
  try {
    set({ isLoading: true, error: null })
    const response = await factusInvoicesService.getInvoiceDetails(
      invoiceNumber
    )
    set({
      currentInvoice: response.data,
      isLoading: false
    })
  } catch (error) {
    set({
      currentInvoice: null,
      error:
        error instanceof Error
          ? error.message
          : 'Error al obtener detalles de la factura',
      isLoading: false
    })
  }
}

// Memoizamos la función fetchInvoiceDetails
const memoizedFetchInvoiceDetails = (set: SetState, get: GetState) => {
  let lastFetch: Promise<void> | null = null
  return async (invoiceNumber: string) => {
    if (lastFetch) {
      await lastFetch
    }
    lastFetch = fetchInvoiceDetailsAction(set, get, invoiceNumber)
    await lastFetch
    lastFetch = null
  }
}

export const useFactusInvoicesStore = create<FactusInvoicesState>()(
  devtools(
    (set, get) => ({
      // Estado inicial
      invoices: [],
      isLoading: false,
      error: null,
      pagination: DEFAULT_PAGINATION,
      filters: DEFAULT_FILTERS,
      currentInvoice: null,

      // Acciones
      fetchInvoices: memoizedFetchInvoices(set, get),
      fetchInvoiceDetails: memoizedFetchInvoiceDetails(set, get),

      setFilters: (newFilters) => {
        const currentFilters = get().filters
        const updatedFilters = { ...currentFilters, ...newFilters, page: 1 }
        set({ filters: updatedFilters })
      },

      clearFilters: () => {
        set({ filters: DEFAULT_FILTERS })
      },

      changePage: (page) => {
        const currentFilters = get().filters
        set({ filters: { ...currentFilters, page } })
      },

      clearError: () => set({ error: null }),

      clearCurrentInvoice: () => set({ currentInvoice: null }),

      downloadInvoicePDF: async (number: string) => {
        try {
          const pdfBlob = await factusInvoicesService.downloadInvoicePDF(number)

          // Crear un blob con la respuesta
          const blob = new Blob([pdfBlob], { type: 'application/pdf' })

          // Crear una URL para el blob
          const url = window.URL.createObjectURL(blob)

          // Crear un elemento <a> temporal
          const link = document.createElement('a')
          link.href = url
          link.download = `factura-${number}.pdf`

          // Simular clic para descargar
          document.body.appendChild(link)
          link.click()

          // Limpiar
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)
        } catch (error: any) {
          set({ error: error.message })
        }
      },

      downloadInvoiceXML: async (number: string) => {
        try {
          const xmlBlob = await factusInvoicesService.downloadInvoiceXML(number)

          // Crear un blob con la respuesta
          const blob = new Blob([xmlBlob], { type: 'application/xml' })

          // Crear una URL para el blob
          const url = window.URL.createObjectURL(blob)

          // Crear un elemento <a> temporal
          const link = document.createElement('a')
          link.href = url
          link.download = `factura-${number}.xml`

          // Simular clic para descargar
          document.body.appendChild(link)
          link.click()

          // Limpiar
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)
        } catch (error: any) {
          set({ error: error.message })
        }
      }
    }),
    {
      name: 'factus-invoices-store'
    }
  )
)
