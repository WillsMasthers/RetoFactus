import DianCatalog from '../models/dianCatalog.model.js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const readJsonFile = (filename) => {
  return JSON.parse(
    readFileSync(join(__dirname, '../shared/catalogs', filename), 'utf-8')
  )
}

const paises = readJsonFile('paises.json')
const ubicaciones = readJsonFile('ubicaciones.json')
const tributos = readJsonFile('tributos.json')
const tributosProductos = readJsonFile('tributosProductos.json')
const tiposDocumentos = readJsonFile('tiposDocumentos.json')
const mediosPagos = readJsonFile('mediosPagos.json')
const medida = readJsonFile('medida.json')

// Versión actual de los catálogos (esto debería venir de la DIAN)
const VERSION_RESOLUCION = '1.0.0'
const FECHA_RESOLUCION = new Date('2024-01-01')

// Cargar catálogos iniciales solo si no existen
export const cargarCatalogosDIAN = async () => {
  try {
    // Verificar si ya existen catálogos
    const existenCatalogos = await DianCatalog.findOne()
    if (existenCatalogos) {
      console.log('Los catálogos DIAN ya están cargados')
      return
    }

    // Cargar países
    for (const pais of paises) {
      await DianCatalog.create({
        tipo: 'paises',
        codigo: pais.codigo,
        nombre: pais.nombre,
        version_resolucion: VERSION_RESOLUCION,
        fecha_resolucion: FECHA_RESOLUCION,
        datos: pais
      })
    }

    // Cargar ubicaciones
    for (const ubicacion of ubicaciones) {
      await DianCatalog.create({
        tipo: 'ubicaciones',
        codigo: ubicacion.codigo,
        nombre: ubicacion.nombre,
        version_resolucion: VERSION_RESOLUCION,
        fecha_resolucion: FECHA_RESOLUCION,
        datos: ubicacion
      })
    }

    // Cargar tributos
    for (const tributo of tributos) {
      await DianCatalog.create({
        tipo: 'tributos',
        codigo: tributo.codigo,
        nombre: tributo.nombre,
        version_resolucion: VERSION_RESOLUCION,
        fecha_resolucion: FECHA_RESOLUCION,
        datos: tributo
      })
    }

    // Cargar tributos de productos
    for (const tributo of tributosProductos) {
      await DianCatalog.create({
        tipo: 'tributosProductos',
        codigo: tributo.codigo,
        nombre: tributo.nombre,
        version_resolucion: VERSION_RESOLUCION,
        fecha_resolucion: FECHA_RESOLUCION,
        datos: tributo
      })
    }

    // Cargar tipos de documentos
    for (const tipo of tiposDocumentos) {
      await DianCatalog.create({
        tipo: 'tiposDocumentos',
        codigo: tipo.codigo,
        nombre: tipo.nombre,
        version_resolucion: VERSION_RESOLUCION,
        fecha_resolucion: FECHA_RESOLUCION,
        datos: tipo
      })
    }

    // Cargar medios de pago
    for (const medio of mediosPagos) {
      await DianCatalog.create({
        tipo: 'mediosPagos',
        codigo: medio.codigo,
        nombre: medio.nombre,
        version_resolucion: VERSION_RESOLUCION,
        fecha_resolucion: FECHA_RESOLUCION,
        datos: medio
      })
    }

    // Cargar medidas
    for (const medidaItem of medida) {
      await DianCatalog.create({
        tipo: 'medidas',
        codigo: medidaItem.codigo,
        nombre: medidaItem.nombre,
        version_resolucion: VERSION_RESOLUCION,
        fecha_resolucion: FECHA_RESOLUCION,
        datos: medidaItem
      })
    }

    console.log('Catálogos DIAN cargados exitosamente')
  } catch (error) {
    console.error('Error al cargar catálogos DIAN:', error)
    throw error
  }
}

// Obtener catálogos por tipo
export const getCatalogosByTipo = async (req, res) => {
  try {
    const { tipo } = req.params
    const catalogos = await DianCatalog.find({ tipo })
      .select('codigo nombre datos')
      .sort('codigo')

    res.json({
      success: true,
      data: catalogos
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener catálogos',
      error: error.message
    })
  }
}

// Obtener un catálogo específico
export const getCatalogoByCodigo = async (req, res) => {
  try {
    const { tipo, codigo } = req.params
    const catalogo = await DianCatalog.findOne({ tipo, codigo }).select(
      'codigo nombre datos'
    )

    if (!catalogo) {
      return res.status(404).json({
        success: false,
        message: 'Catálogo no encontrado'
      })
    }

    res.json({
      success: true,
      data: catalogo
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener catálogo',
      error: error.message
    })
  }
}

// Verificar versión de catálogos
export const verificarVersionCatalogos = async (req, res) => {
  try {
    const { tipo } = req.params
    const { version } = req.query

    const hayNuevaVersion = await DianCatalog.checkNewVersion(tipo, version)

    res.json({
      success: true,
      hayNuevaVersion,
      versionActual: VERSION_RESOLUCION,
      fechaResolucion: FECHA_RESOLUCION
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al verificar versión de catálogos',
      error: error.message
    })
  }
}
