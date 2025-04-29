import axios from 'axios'

const API = 'http://localhost:4000/api'

export const registerRequest = async (user) => {
  try {
    const response = await axios.post(`${API}/register`, user)
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

export const loginRequest = async (user) => {
  try {
    console.log('Enviando datos de login:', user)
    const response = await axios.post(`${API}/login`, user)
    return response.data
  } catch (error) {
    console.error('Error en login:', error.response?.data || error)
    if (error.response?.data?.message) {
      throw error.response.data.message
    }
    throw 'Error al iniciar sesión'
  }
}

export const logoutRequest = async () => {
  try {
    const response = await axios.post(`${API}/logout`)
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}
