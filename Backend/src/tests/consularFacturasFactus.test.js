// Test de consola para getFacturas
import { factusService } from '../services/factus.service.js'
import { getFactusToken } from '../services/factus.auth.service.js'

// Función para probar diferentes filtros de facturas
async function testGetFacturas(filtros = {}) {
  try {
    console.log('Obteniendo token de Factus...')
    const { accessToken } = await getFactusToken()
    console.log('Token obtenido:', accessToken ? 'OK' : 'FALLÓ') // Agregar página por defecto si no viene en los filtros
    if (!filtros.page) filtros.page = 1

    console.log('Consultando facturas con los siguientes filtros:', filtros)
    const facturas = await factusService.getFacturas(filtros, accessToken)

    console.log('Respuesta de Factus:')
    console.dir(facturas, { depth: null })

    // Mostrar información de paginación
    const { pagination } = facturas.data
    console.log('\nInformación de paginación:')
    console.log(
      `Página actual: ${pagination.current_page} de ${pagination.last_page}`
    )
    console.log(
      `Mostrando registros ${pagination.from} al ${pagination.to} de ${pagination.total}`
    )
  } catch (error) {
    console.error('Error al consultar facturas:', error.message)
  }
}

// Ejemplos de diferentes consultas

// 1. Consultar solo por página (10 facturas por página)
console.log('\n1. Consultar página 2:')
await testGetFacturas({ page: 2, status: 1 })

// 2. Filtrar por número de identificación
console.log('\n2. Consultar facturas por identificación:')
await testGetFacturas({ identification: '222222222', status: 1 })

// 3. Filtrar por nombre
console.log('\n3. Consultar facturas por nombre:')
await testGetFacturas({ names: 'Mauricio', status: 1 })

// 4. Buscar una factura específica por número
console.log('\n4. Consultar factura específica:')
await testGetFacturas({ number: 'SETP990013482', status: 1 })

// 5. Combinación de filtros
console.log('\n5. Consulta con múltiples filtros:')
await testGetFacturas({
  identification: '222222222',
  names: 'Mauricio',
  status: 1,
  page: 1
})
