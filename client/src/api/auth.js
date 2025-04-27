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
