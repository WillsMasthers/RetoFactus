import { Category } from '../models/category.model.js'
import { Product } from '../models/product.model.js'
import { v4 as uuidv4 } from 'uuid'

// Obtener todas las categorías
export const getCategories = async (req, res) => {
  console.log('🔍 Buscando todas las categorías activas...')
  try {
    const categories = await Category.find({ is_active: true })
    console.log(`✅ Se encontraron ${categories.length} categorías`)
    res.json(categories)
  } catch (error) {
    console.error('❌ Error al obtener categorías:', error)
    res
      .status(500)
      .json({ message: 'Error al obtener categorías', error: error.message })
  }
}

// Obtener una categoría específica
export const getCategory = async (req, res) => {
  const { uuid } = req.params
  console.log(`🔍 Buscando categoría con UUID: ${uuid}`)
  try {
    const category = await Category.findOne({ uuid, is_active: true })
    if (!category) {
      console.log('❌ Categoría no encontrada')
      return res.status(404).json({ message: 'Categoría no encontrada' })
    }
    console.log('✅ Categoría encontrada:', category.name)
    res.json(category)
  } catch (error) {
    console.error('❌ Error al obtener la categoría:', error)
    res
      .status(500)
      .json({ message: 'Error al obtener la categoría', error: error.message })
  }
}

// Crear nueva categoría
export const createCategory = async (req, res) => {
  const { name, parent_id, customization } = req.body
  console.log('📝 Creando nueva categoría:', { name, parent_id, customization })
  try {
    // Verificar si ya existe una categoría con el mismo nombre
    const existingCategory = await Category.findOne({ name, is_active: true })
    if (existingCategory) {
      console.log('❌ Ya existe una categoría con este nombre')
      return res
        .status(400)
        .json({ message: 'Ya existe una categoría con este nombre' })
    }

    // Si tiene parent_id, verificar que exista
    let level = 1
    let path = name
    if (parent_id) {
      console.log(`🔍 Verificando categoría padre: ${parent_id}`)
      const parentCategory = await Category.findOne({
        uuid: parent_id,
        is_active: true
      })
      if (!parentCategory) {
        console.log('❌ Categoría padre no encontrada')
        return res
          .status(404)
          .json({ message: 'Categoría padre no encontrada' })
      }
      level = parentCategory.level + 1
      path = `${parentCategory.path}/${name}`
      console.log(
        `✅ Categoría padre encontrada. Nuevo nivel: ${level}, Path: ${path}`
      )
    }

    const category = await Category.create({
      uuid: uuidv4(),
      name,
      parent_id,
      level,
      path,
      customization,
      is_active: true
    })

    console.log('✅ Categoría creada exitosamente:', category.name)
    res.status(201).json(category)
  } catch (error) {
    console.error('❌ Error al crear la categoría:', error)
    res
      .status(500)
      .json({ message: 'Error al crear la categoría', error: error.message })
  }
}

// Actualizar categoría
export const updateCategory = async (req, res) => {
  const { uuid } = req.params
  const { name, parent_id, customization } = req.body
  console.log(`📝 Actualizando categoría ${uuid}:`, {
    name,
    parent_id,
    customization
  })
  try {
    const category = await Category.findOne({ uuid, is_active: true })
    if (!category) {
      console.log('❌ Categoría no encontrada')
      return res.status(404).json({ message: 'Categoría no encontrada' })
    }

    // Si se cambia el nombre, verificar que no exista otro con el mismo nombre
    if (name && name !== category.name) {
      console.log(`🔍 Verificando disponibilidad del nombre: ${name}`)
      const existingCategory = await Category.findOne({ name, is_active: true })
      if (existingCategory) {
        console.log('❌ Ya existe una categoría con este nombre')
        return res
          .status(400)
          .json({ message: 'Ya existe una categoría con este nombre' })
      }
    }

    // Si se cambia el parent_id, actualizar level y path
    if (parent_id && parent_id !== category.parent_id) {
      console.log(`🔍 Verificando nueva categoría padre: ${parent_id}`)
      const parentCategory = await Category.findOne({
        uuid: parent_id,
        is_active: true
      })
      if (!parentCategory) {
        console.log('❌ Categoría padre no encontrada')
        return res
          .status(404)
          .json({ message: 'Categoría padre no encontrada' })
      }
      category.level = parentCategory.level + 1
      category.path = `${parentCategory.path}/${name || category.name}`
      console.log(
        `✅ Categoría padre encontrada. Nuevo nivel: ${category.level}, Path: ${category.path}`
      )
    }

    // Actualizar campos
    if (name) category.name = name
    if (parent_id) category.parent_id = parent_id
    if (customization) category.customization = customization
    category.updated_at = new Date()

    await category.save()
    console.log('✅ Categoría actualizada exitosamente:', category.name)
    res.json(category)
  } catch (error) {
    console.error('❌ Error al actualizar la categoría:', error)
    res
      .status(500)
      .json({
        message: 'Error al actualizar la categoría',
        error: error.message
      })
  }
}

// Eliminar categoría (inteligente)
export const deleteCategory = async (req, res) => {
  const { uuid } = req.params
  console.log(`🗑️  Intentando eliminar categoría: ${uuid}`)
  try {
    const category = await Category.findOne({ uuid })
    if (!category) {
      console.log('❌ Categoría no encontrada')
      return res.status(404).json({ message: 'Categoría no encontrada' })
    }

    // Verificar si la categoría está en uso
    console.log('🔍 Verificando uso de la categoría...')
    const productsInUse = await Product.findOne({
      category_id: category.uuid,
      is_active: true
    })
    const subCategories = await Category.findOne({
      parent_id: category.uuid,
      is_active: true
    })

    if (productsInUse || subCategories) {
      console.log('ℹ️  Categoría en uso, realizando soft delete')
      category.is_active = false
      category.updated_at = new Date()
      await category.save()
      return res.json({ message: 'Categoría desactivada (en uso)' })
    }

    console.log('✅ Categoría no está en uso, eliminando permanentemente')
    await Category.deleteOne({ uuid: category.uuid })
    res.json({ message: 'Categoría eliminada permanentemente' })
  } catch (error) {
    console.error('❌ Error al eliminar la categoría:', error)
    res
      .status(500)
      .json({ message: 'Error al eliminar la categoría', error: error.message })
  }
}
