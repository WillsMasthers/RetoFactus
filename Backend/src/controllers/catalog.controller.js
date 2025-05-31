import Catalog from '../models/catalog.model.js'
import paises from '../shared/catalogs/paises.json' assert { type: 'json' }
import ubicaciones from '../shared/catalogs/ubicaciones.json' assert { type: 'json' }
import tributos from '../shared/catalogs/tributos.json' assert { type: 'json' }
import tributosProductos from '../shared/catalogs/tributosProductos.json' assert { type: 'json' }
import tiposDocumentos from '../shared/catalogs/tiposDocumentos.json' assert { type: 'json' }
import mediosPagos from '../shared/catalogs/mediosPagos.json' assert { type: 'json' }
import medida from '../shared/catalogs/medida.json' assert { type: 'json' }

// Cargar catálogos iniciales
export const cargarCatalogos = async () => {
  try {
    // Cargar países
    for (const pais of paises) {
      await Catalog.findOneAndUpdate(
        { tipo: 'paises', codigo: pais.codigo },
        { nombre: pais.nombre, datos_adicionales: pais },
        { upsert: true }
      )
    }

    // Cargar ubicaciones
    for (const ubicacion of ubicaciones) {
      await Catalog.findOneAndUpdate(
        { tipo: 'ubicaciones', codigo: ubicacion.codigo },
        { nombre: ubicacion.nombre, datos_adicionales: ubicacion },
        { upsert: true }
      )
    }

    // Cargar tributos
    for (const tributo of tributos) {
      await Catalog.findOneAndUpdate(
        { tipo: 'tributos', codigo: tributo.codigo },
        { nombre: tributo.nombre, datos_adicionales: tributo },
        { upsert: true }
      )
    }

    // Cargar tributos de productos
    for (const tributo of tributosProductos) {
      await Catalog.findOneAndUpdate(
        { tipo: 'tributosProductos', codigo: tributo.codigo },
        { nombre: tributo.nombre, datos_adicionales: tributo },
        { upsert: true }
      )
    }

    // Cargar tipos de documentos
    for (const tipo of tiposDocumentos) {
      await Catalog.findOneAndUpdate(
        { tipo: 'tiposDocumentos', codigo: tipo.codigo },
        { nombre: tipo.nombre, datos_adicionales: tipo },
        { upsert: true }
      )
    }

    // Cargar medios de pago
    for (const medio of mediosPagos) {
      await Catalog.findOneAndUpdate(
        { tipo: 'mediosPagos', codigo: medio.codigo },
        { nombre: medio.nombre, datos_adicionales: medio },
        { upsert: true }
      )
    }

    // Cargar medidas
    for (const medidaItem of medida) {
      await Catalog.findOneAndUpdate(
        { tipo: 'medidas', codigo: medidaItem.codigo },
        { nombre: medidaItem.nombre, datos_adicionales: medidaItem },
        { upsert: true }
      )
    }

    console.log('Catálogos cargados exitosamente')
  } catch (error) {
    console.error('Error al cargar catálogos:', error)
    throw error
  }
}

// Obtener catálogos por tipo
export const getCatalogosByTipo = async (req, res) => {
  try {
    const { tipo } = req.params
    const catalogos = await Catalog.find({ tipo, activo: true })
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
    const catalogo = await Catalog.findOne({ tipo, codigo, activo: true })

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
