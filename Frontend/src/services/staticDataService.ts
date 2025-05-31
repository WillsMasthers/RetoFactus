import { ref } from 'vue'

interface StaticData {
  documentTypes: Array<{
    code: string
    name: string
  }>
  legalOrganizations: Array<{
    id: number
    code: string
    name: string
  }>
  paymentForms: Array<{
    code: string
    name: string
  }>
  paymentMethods: Array<{
    code: string
    name: string
  }>
  unitMeasures: Array<{
    id: number
    code: string
    name: string
  }>
  standardCodes: Array<{
    id: number
    code: string
    name: string
  }>
  taxes: Array<{
    id: number
    code: string
    name: string
  }>
  withholdingTaxes: Array<{
    code: string
    name: string
  }>
}

export const useStaticData = () => {
  const staticData = ref<StaticData | null>(null)

  const loadStaticData = async () => {
    try {
      const response = await fetch('/static-data.json')
      const data = await response.json()
      staticData.value = data
    } catch (error) {
      console.error('Error loading static data:', error)
    }
  }

  return {
    staticData,
    loadStaticData
  }
}
