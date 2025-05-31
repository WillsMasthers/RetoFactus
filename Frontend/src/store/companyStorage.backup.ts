/**
 * @file companyStorage.backup.ts
 * @description Copia de seguridad del store de empresa original
 * @created 2025-05-21
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import axios from 'axios'

const API = 'http://localhost:4000/api'

export interface CompanyData {
  nit: string
  dv: string
  company: string
  name: string
  graphic_representation_name: string
  registration_code: string
  economic_activity: string
  phone: string
  email: string
  direction: string
  pais: string
  department: string
  municipality: string
  codigo_postal: string
}

interface CompanyStore {
  formData: CompanyData
  loading: boolean
  error: string | null
  setFormData: (
    data: Partial<CompanyData> | ((prev: CompanyData) => CompanyData)
  ) => void
  clearFormData: () => void
  fetchCompanyData: () => Promise<void>
  updateCompanyData: (data: Partial<CompanyData>) => Promise<void>
}

const initialState: CompanyData = {
  nit: '',
  dv: '',
  company: '',
  name: '',
  graphic_representation_name: '',
  registration_code: '',
  economic_activity: '',
  phone: '',
  email: '',
  direction: '',
  pais: '',
  department: '',
  municipality: '',
  codigo_postal: ''
}

export const useCompanyStorage = create<CompanyStore>()(
  devtools(
    persist(
      (set) => ({
        formData: { ...initialState },
        loading: false,
        error: null,
        setFormData: (data) =>
          set(
            (state) => ({
              formData:
                typeof data === 'function'
                  ? data(state.formData)
                  : { ...state.formData, ...data },
              error: null
            }),
            false,
            'SET_FORM_DATA'
          ),
        clearFormData: () =>
          set(
            { formData: { ...initialState }, error: null },
            false,
            'CLEAR_FORM_DATA'
          ),
        fetchCompanyData: async () => {
          set({ loading: true, error: null })
          try {
            const response = await axios.get(`${API}/company`)
            set({ formData: response.data, loading: false })
          } catch (error) {
            set({
              error:
                error.response?.data?.message ||
                'Error al cargar los datos de la empresa',
              loading: false
            })
          }
        },
        updateCompanyData: async (data) => {
          set({ loading: true, error: null })
          try {
            const response = await axios.put(`${API}/company`, data)
            set({ formData: response.data, loading: false })
          } catch (error) {
            set({
              error:
                error.response?.data?.message ||
                'Error al actualizar los datos de la empresa',
              loading: false
            })
          }
        }
      }),
      {
        name: 'company-storage',
        partialize: (state) => ({
          formData: state.formData
        })
      }
    )
  )
)
