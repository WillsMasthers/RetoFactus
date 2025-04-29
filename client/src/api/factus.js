import axios from 'axios'

const API = 'http://localhost:4000/api'

export const createFactura = async (facturaData, confirmar = false) => {
  try {
    const response = await axios.post(
      `${API}/factus/facturas${confirmar ? '?confirmar=true' : ''}`,
      facturaData
    )
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

export const getFacturas = async () => {
  try {
    const response = await axios.get(`${API}/factus/facturas`)
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}
