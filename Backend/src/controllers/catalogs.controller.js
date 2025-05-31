import Catalog from '../models/catalog.model.js'
import mongoose from 'mongoose'

export const catalogsController = {
  async getDepartamentos(req, res) {
    try {
      // Buscar todos los departamentos
      const departamentos = await Catalog.find({ tipo: 'ubicaciones', datos_adicionales: { $exists: true } })
      
      if (!departamentos || departamentos.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No se encontraron departamentos'
        })
      }

      // Formatear los datos para la respuesta
      const formattedDepartamentos = departamentos.map(dept => ({
        id: dept.datos_adicionales.id,
        code: dept.datos_adicionales.code,
        name: dept.datos_adicionales.name
      }))

      return res.status(200).json({
        success: true,
        data: formattedDepartamentos
      })
    } catch (error) {
      console.error('Error al obtener departamentos:', error)
      return res.status(500).json({
        success: false,
        message: 'Error al obtener departamentos'
      })
    }
  },

  async getMunicipios(req, res) {
    try {
      const { department } = req.params

      // Buscar el departamento correspondiente
      const departamento = await Catalog.findOne({ 
        tipo: 'ubicaciones', 
        'datos_adicionales.id': parseInt(department)
      })

      if (!departamento) {
        return res.status(404).json({
          success: false,
          message: 'Departamento no encontrado'
        })
      }

      // Formatear los datos para la respuesta
      const formattedMunicipios = departamento.datos_adicionales.municipios.map(municipio => ({
        id: municipio.id,
        code: municipio.code,
        name: municipio.name
      }))

      return res.status(200).json({
        success: true,
        data: formattedMunicipios
      })
    } catch (error) {
      console.error('Error al obtener municipios:', error)
      return res.status(500).json({
        success: false,
        message: 'Error al obtener municipios'
      })
    }
  },

  async getCatalogosByTipo(req, res) {
    try {
      const { tipo } = req.params
      const catalogos = await Catalog.find({ tipo, activo: true })
      
      if (!catalogos || catalogos.length === 0) {
        return res.status(404).json({
          success: false,
          message: `No se encontraron catálogos del tipo ${tipo}`
        })
      }

      return res.status(200).json({
        success: true,
        data: catalogos
      })
    } catch (error) {
      console.error('Error al obtener catálogos:', error)
      return res.status(500).json({
        success: false,
        message: 'Error al obtener catálogos'
      })
    }
  }
}
