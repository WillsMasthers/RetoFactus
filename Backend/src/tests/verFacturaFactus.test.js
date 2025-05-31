import { factusService } from '../services/factus.service.js'
import { getFactusToken } from '../services/factus.auth.service.js'

// Función para obtener el token de Factus
async function getToken() {
  try {
    console.log('Obteniendo token de Factus...')
    const { accessToken } = await getFactusToken()
    console.log('Token obtenido:', accessToken ? 'OK' : 'FALLÓ')
    return accessToken
  } catch (error) {
    console.error('Error al obtener token:', error)
    throw error
  }
}

// Función principal de test
async function testViewInvoice() {
  try {
    // Primero obtenemos el token
    const token = await getToken()

    // id de la factura que se esperaria desde el Frontend
    const idFactura = 'SETP990013531'
    // Luego intentamos ver la factura
    console.log(`Intentando ver factura ${idFactura}...`)

    try {
      // Usamos factusService directamente
      const response = await factusService.getInvoice(idFactura, token)
      console.log('Respuesta recibida:')
      console.dir(response, { depth: null })
    } catch (error) {
      console.error('Error en petición:', {
        status: error.response?.status,
        headers: error.response?.headers,
        data: error.response?.data,
        config: error.config
      })
      throw error
    }
  } catch (error) {
    console.error('Error al ver factura:', error)
  }
}

// Ejecutar el test
testViewInvoice()
