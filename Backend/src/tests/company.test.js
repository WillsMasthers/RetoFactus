import mongoose from 'mongoose'
import axios from 'axios'
import assert from 'assert'

const API = 'http://localhost:4000/api'
let authToken = null

const generateUniqueNIT = () => {
  const timestamp = Date.now().toString()
  return `900${timestamp.substring(timestamp.length - 6)}`
}

const uniqueNIT = generateUniqueNIT()

const testCompanyData = {
  identification: {
    nit: uniqueNIT,
    dv: '0',
    document_type: 'NIT'
  },
  name: {
    company: `Empresa de Prueba ${uniqueNIT}`,
    commercial: `Empresa Comercial ${uniqueNIT}`,
    graphic_representation: `Empresa ${uniqueNIT}`,
    registration: {
      code: `TEST-${Date.now().toString().slice(-6)}`,
      economic_activity: '6311'
    }
  },
  contact: {
    email: `test-${uniqueNIT}@empresa.com`,
    phone: '3001234567'
  },
  location: {
    country: 'CO',
    department: 'Norte de Santander',
    municipality: 'Ocaña',
    address: 'Calle 123 # 45-67',
    postal_code: '54498'
  },
  logo: {
    url: 'https://ejemplo.com/logo.png'
  },
  billing_config: {
    invoice_prefix: 'FACT',
    invoice_resolution: 'RES-123',
    invoice_start_number: 1,
    invoice_end_number: 1000,
    invoice_current_number: 1,
    invoice_notes: 'Gracias por su compra',
    payment_terms: 'Contado',
    payment_methods: ['efectivo', 'tarjeta'],
    taxes: ['iva19']
  },
  administrador: null, // Se asignará dinámicamente
  is_active: true
}

// Conexión a la base de datos
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/retofactus')
    console.log('MongoDB conectado para test')
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error)
    process.exit(1)
  }
}

const loginWithAdmin = async () => {
  try {
    const loginResponse = await axios.post(`${API}/auth/login`, {
      username: 'admin',
      password: 'admin123'
    })

    authToken = loginResponse.data.user.token
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
    console.log('Token obtenido exitosamente')
  } catch (error) {
    console.error('Error al iniciar sesión:', error.response?.data || error)
    throw error
  }
}

async function runTests() {
  try {
    console.log('🚀 Iniciando pruebas de API de Empresa...')

    // Configurar la conexión y autenticación
    const userIdFromToken = await setupConnection()

    // Preparar datos de prueba
    await prepareTestData()

    // Verificar si ya existe una empresa
    let companyId, companyCreated
    const existingCompanies = await axios.get(`${API}/company`)

    if (
      existingCompanies.data.companies &&
      existingCompanies.data.companies.length > 0
    ) {
      console.log('✅ Usando empresa existente')
      companyCreated = existingCompanies.data.companies[0]
      companyId = companyCreated._id
    } else {
      console.log(
        'ℹ️ No se encontraron empresas existentes, creando una nueva...'
      )
      const result = await testCompanyCreation()
      companyId = result.companyId
      companyCreated = result.companyCreated
    }

    // Ejecutar los tests
    await testCompanyListing()
    await testCompanyUpdate(userIdFromToken, companyId, companyCreated)

    console.log('\n🎉 Todas las pruebas completadas exitosamente!')
  } catch (error) {
    console.error(
      '\n❌ Error durante las pruebas:',
      error.response?.data?.message || error.message,
      '\nDetalles:',
      JSON.stringify(error.response?.data || error, null, 2)
    )
    throw error
  } finally {
    await mongoose.connection.close()
    console.log('Conexión a MongoDB cerrada')
  }
}

async function setupConnection() {
  // Conectar a la base de datos
  await connectDB()
  // Iniciar sesión con el usuario admin
  await loginWithAdmin()
  // Obtener el ID del usuario del token
  const userId = authToken.split('.')[1]
  const decoded = JSON.parse(Buffer.from(userId, 'base64').toString())
  testCompanyData.administrador = decoded.id // Asignar el ID del administrador
  return decoded.id
}

async function prepareTestData() {
  console.log('\n🔍 Preparando datos de prueba...')
  
  // Actualizar datos de identificación
  testCompanyData.identification.nit = uniqueNIT
  testCompanyData.identification.dv = '0'
  testCompanyData.identification.document_type = 'NIT'
  
  // Actualizar datos del nombre
  testCompanyData.name.company = `Empresa de Prueba ${uniqueNIT}`
  testCompanyData.name.commercial = `Empresa Comercial ${uniqueNIT}`
  testCompanyData.name.graphic_representation = `Empresa ${uniqueNIT}`
  testCompanyData.name.registration.code = `TEST-${Date.now().toString().slice(-6)}`
  testCompanyData.name.registration.economic_activity = '6311'
  
  // Actualizar datos de contacto
  testCompanyData.contact.email = `test-${uniqueNIT}@empresa.com`
  testCompanyData.contact.phone = '3001234567'
  
  // Actualizar ubicación
  testCompanyData.location = {
    country: 'CO',
    department: 'Norte de Santander',
    municipality: 'Ocaña',
    address: 'Calle 123 # 45-67',
    postal_code: '54498'
  }
  
  // Actualizar logo
  testCompanyData.logo = {
    url: `https://ejemplo.com/logos/empresa-${uniqueNIT}.png`
  }
}

async function testCompanyCreation() {
  console.log('\n➡️ Test 1: Crear nueva empresa')
  try {
    // Obtener el ID del usuario del token
    const userId = authToken.split('.')[1]
    const decoded = JSON.parse(Buffer.from(userId, 'base64').toString())
    const userIdFromToken = decoded.id

    // Obtener los detalles completos del usuario
    const userResponse = await axios.get(`${API}/users/${userIdFromToken}`)

    // Crear la empresa
    const createResponse = await axios.post(`${API}/company`, testCompanyData)
    if (createResponse.status !== 201) {
      throw new Error(`Error al crear empresa: ${createResponse.data.message}`)
    }

    const companyId = createResponse.data.company._id
    const companyCreated = createResponse.data.company

    // Verificar que la empresa se creó con la estructura correcta
    console.log('\n🔍 Verificando estructura de la empresa creada...')
    const company = companyCreated
    
    // Verificar que la respuesta contenga los datos de la empresa
    assert.ok(company._id, 'La empresa debe tener un ID')
  
    // Verificar identificación
    assert.ok(company.identification, 'La identificación es requerida')
    assert.strictEqual(company.identification.nit, testCompanyData.identification.nit, 'El NIT no coincide')
    assert.strictEqual(company.identification.dv, testCompanyData.identification.dv, 'El DV no coincide')
    assert.strictEqual(company.identification.document_type, testCompanyData.identification.document_type, 'El tipo de documento no coincide')
  
    // Verificar datos del nombre
    assert.ok(company.name, 'El nombre es requerido')
    assert.strictEqual(company.name.company, testCompanyData.name.company, 'El nombre de la empresa no coincide')
    assert.strictEqual(company.name.commercial, testCompanyData.name.commercial, 'El nombre comercial no coincide')
    assert.strictEqual(company.name.graphic_representation, testCompanyData.name.graphic_representation, 'La representación gráfica no coincide')
    assert.strictEqual(company.name.registration.code, testCompanyData.name.registration.code, 'El código de registro no coincide')
    assert.strictEqual(company.name.registration.economic_activity, testCompanyData.name.registration.economic_activity, 'La actividad económica no coincide')
  
    // Verificar datos de contacto
    assert.ok(company.contact, 'La información de contacto es requerida')
    assert.strictEqual(company.contact.email, testCompanyData.contact.email, 'El correo electrónico no coincide')
    assert.strictEqual(company.contact.phone, testCompanyData.contact.phone, 'El teléfono no coincide')
  
    // Verificar ubicación
    assert.ok(company.location, 'La ubicación es requerida')
    assert.strictEqual(company.location.country, testCompanyData.location.country, 'El país no coincide')
    assert.strictEqual(company.location.department, testCompanyData.location.department, 'El departamento no coincide')
    assert.strictEqual(company.location.municipality, testCompanyData.location.municipality, 'El municipio no coincide')
    assert.strictEqual(company.location.address, testCompanyData.location.address, 'La dirección no coincide')
    assert.strictEqual(company.location.postal_code, testCompanyData.location.postal_code, 'El código postal no coincide')
  
    // Verificar logo
    assert.ok(company.logo, 'El logo es requerido')
    assert.strictEqual(company.logo.url, testCompanyData.logo.url, 'La URL del logo no coincide')
  
    // Verificar configuración de facturación
    assert.ok(company.billing_config, 'La configuración de facturación es requerida')
    assert.strictEqual(company.billing_config.invoice_prefix, testCompanyData.billing_config.invoice_prefix, 'El prefijo de factura no coincide')
    assert.strictEqual(company.billing_config.invoice_resolution, testCompanyData.billing_config.invoice_resolution, 'La resolución de factura no coincide')
    assert.strictEqual(company.billing_config.invoice_start_number, testCompanyData.billing_config.invoice_start_number, 'El número inicial de factura no coincide')
    assert.strictEqual(company.billing_config.invoice_end_number, testCompanyData.billing_config.invoice_end_number, 'El número final de factura no coincide')
    assert.strictEqual(company.billing_config.invoice_current_number, testCompanyData.billing_config.invoice_current_number, 'El número actual de factura no coincide')
    assert.strictEqual(company.billing_config.invoice_notes, testCompanyData.billing_config.invoice_notes, 'Las notas de factura no coinciden')
    assert.strictEqual(company.billing_config.payment_terms, testCompanyData.billing_config.payment_terms, 'Los términos de pago no coinciden')
    assert.deepStrictEqual(company.billing_config.payment_methods, testCompanyData.billing_config.payment_methods, 'Los métodos de pago no coinciden')
    assert.deepStrictEqual(company.billing_config.taxes, testCompanyData.billing_config.taxes, 'Los impuestos no coinciden')
  
    // Verificar estado y referencias
    assert.strictEqual(company.is_active, true, 'La empresa debe estar activa')
    assert.strictEqual(company.administrador.toString(), testCompanyData.administrador.toString(), 'El administrador no coincide')
    
    // Verificar que el usuario tenga la empresa asignada
    console.log('\n🔍 Verificando asignación de empresa al usuario...')
    console.log('ID de usuario:', userIdFromToken)
    console.log('ID de empresa creada:', companyId)

    // Esperar un momento para asegurar que la actualización se haya completado
    await new Promise((resolve) => setTimeout(resolve, 500))

    const updatedUser = await axios.get(`${API}/users/${userIdFromToken}`)
    console.log(
      'Datos completos del usuario actualizado:',
      JSON.stringify(updatedUser.data, null, 2)
    )

    const userCompanies = updatedUser.data.user?.empresas || []
    console.log('Empresas del usuario:', JSON.stringify(userCompanies, null, 2))

    const hasCompany = userCompanies.some((emp) => {
      const empresaId = emp.empresa?._id?.toString() || emp.empresa?.toString()
      console.log(`Comparando empresa: ${empresaId} con ${companyId}`)
      return empresaId === companyId.toString()
    })

    if (!hasCompany) {
      console.error('❌ Error: La empresa no fue asignada al usuario')
      console.error(
        'Empresas del usuario:',
        userCompanies.map((e) => ({
          empresa: e.empresa?._id || e.empresa,
          rol: e.rol,
          activo: e.activo
        }))
      )
      throw new Error(
        `La empresa ${companyId} no fue asignada al usuario ${userIdFromToken}`
      )
    }

    console.log('✅ Empresa asignada correctamente al usuario')

    console.log(
      '✅ Test 1 completado: Empresa creada y asignada al usuario exitosamente'
    )
    return { companyId, companyCreated }
  } catch (error) {
    throw new Error(
      `❌ Error durante la creación: ${
        error.message
      }\nDetalles: ${JSON.stringify(error.response?.data || {}, null, 2)}`
    )
  }
}

async function testCompanyListing() {
  console.log('\n➡️ Test 2: Obtener datos de empresa')
  try {
    const getResponse = await axios.get(`${API}/company`)
    if (getResponse.status !== 200) {
      throw new Error(`Error al obtener empresas: ${getResponse.data.message}`)
    }
    const companies = getResponse.data.companies
    if (companies.length === 0) {
      throw new Error('No se encontraron empresas para el usuario')
    }
    console.log('✅ Test 2 completado: Empresas obtenidas exitosamente')
    return companies[0]
  } catch (error) {
    throw new Error(
      `❌ Error durante la obtención: ${
        error.message
      }\nDetalles: ${JSON.stringify(error.response?.data || {}, null, 2)}`
    )
  }
}

async function testCompanyUpdate(userIdFromToken, companyId, companyCreated) {
  console.log('\n➡️ Test 3: Actualizar datos de empresa')

  // Datos actuales
  console.log('\n📋 Datos actuales de la empresa:')
  console.log('- Razon social:', companyCreated.razon_social)
  console.log('- Teléfono:', companyCreated.telefono)

  // Datos a actualizar
  const updatedData = {
    razon_social: 'Empresa Malvados y asociados SAS',
    telefono: '3009876543'
  }

  console.log('\n🔄 Datos a actualizar:', updatedData)

  try {
    // Verificar que el usuario es el administrador
    const adminId =
      typeof companyCreated.administrador === 'object'
        ? companyCreated.administrador._id.toString()
        : companyCreated.administrador.toString()

    console.log(
      '\n🔍 Verificando administrador:',
      adminId,
      'vs',
      userIdFromToken
    )
    if (adminId !== userIdFromToken) {
      throw new Error('El usuario no es el administrador de la empresa')
    }

    // Realizar la actualización
    console.log('\n🔄 Actualizando empresa...')
    const updateResponse = await axios.put(
      `${API}/company/${companyId}`,
      updatedData
    )

    if (updateResponse.status !== 200) {
      throw new Error(
        `Error al actualizar empresa: ${updateResponse.data.message}`
      )
    }

    // Mostrar datos después de la actualización
    console.log('\n✅ Datos actualizados exitosamente:')
    console.log(
      '- Nueva razón social:',
      updateResponse.data.company.razon_social
    )
    console.log('- Nuevo teléfono:', updateResponse.data.company.telefono)

    console.log('\n✅ Test 3 completado: Empresa actualizada exitosamente')
  } catch (error) {
    throw new Error(
      `❌ Error durante la actualización: ${
        error.message
      }\nDetalles: ${JSON.stringify(error.response?.data || {}, null, 2)}`
    )
  }
}

// Ejecutar el test si se llama directamente
if (import.meta.url.includes('company.test.js')) {
  runTests()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Error en el test:', error)
      process.exit(1)
    })
}
