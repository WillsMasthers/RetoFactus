import { Brand } from '../models/brand.model.js'
import { v4 as uuidv4 } from 'uuid'

// Obtener todas las marcas activas
export const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find({ is_active: true })
    res.json(brands)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las marcas', error: error.message })
  }
}

// Obtener una marca por UUID
export const getBrand = async (req, res) => {
  const { uuid } = req.params
  
  try {
    const brand = await Brand.findOne({ uuid, is_active: true })
    if (!brand) {
      return res.status(404).json({ message: 'Marca no encontrada' })
    }
    res.json(brand)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la marca', error: error.message })
  }
}

// Crear una nueva marca
export const createBrand = async (req, res) => {
  const { name, description, informacion } = req.body

  try {
    // Verificar si ya existe una marca con el mismo nombre
    const existingBrand = await Brand.findOne({ name })
    if (existingBrand) {
      return res.status(400).json({ message: 'Ya existe una marca con este nombre' })
    }

    const brand = new Brand({
      uuid: uuidv4(),
      name,
      description: description || '',
      informacion: {
        titulo: informacion?.titulo || '',
        url: informacion?.url || '',
        descripcion: informacion?.descripcion || ''
      }
    })

    await brand.save()
    res.status(201).json(brand)
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la marca', error: error.message })
  }
}

// Actualizar una marca
export const updateBrand = async (req, res) => {
  const { uuid } = req.params
  const { name, description, is_active, informacion } = req.body

  try {
    const brand = await Brand.findOne({ uuid })
    if (!brand) {
      return res.status(404).json({ message: 'Marca no encontrada' })
    }

    // Verificar si el nuevo nombre ya existe en otra marca
    if (name && name !== brand.name) {
      const existingBrand = await Brand.findOne({ name })
      if (existingBrand) {
        return res.status(400).json({ message: 'Ya existe una marca con este nombre' })
      }
      brand.name = name
    }

    if (description !== undefined) brand.description = description
    if (is_active !== undefined) brand.is_active = is_active
    
    // Actualizar campos de información si se proporcionan
    if (informacion) {
      brand.informacion = {
        titulo: informacion.titulo !== undefined ? informacion.titulo : brand.informacion?.titulo || '',
        url: informacion.url !== undefined ? informacion.url : brand.informacion?.url || '',
        descripcion: informacion.descripcion !== undefined ? informacion.descripcion : brand.informacion?.descripcion || ''
      }
    }

    brand.updated_at = new Date()
    await brand.save()

    res.json(brand)
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la marca', error: error.message })
  }
}

// Eliminar una marca (soft delete)
export const deleteBrand = async (req, res) => {
  const { uuid } = req.params

  try {
    // Verificar si hay productos asociados a esta marca
    const productCount = await Product.countDocuments({ brand_id: uuid, is_active: true })
    if (productCount > 0) {
      return res.status(400).json({ 
        message: 'No se puede eliminar la marca porque tiene productos asociados' 
      })
    }

    const brand = await Brand.findOneAndUpdate(
      { uuid },
      { is_active: false, updated_at: new Date() },
      { new: true }
    )

    if (!brand) {
      return res.status(404).json({ message: 'Marca no encontrada' })
    }

    res.json({ message: 'Marca eliminada correctamente' })
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la marca', error: error.message })
  }
}
