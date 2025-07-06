import { Product } from '../models/product.model.js'
import { Category } from '../models/category.model.js'
import { Brand } from '../models/brand.model.js'
import { v4 as uuidv4 } from 'uuid'

// Obtener todos los productos
export const getProducts = async (req, res) => {
  console.log('🔍 Buscando todos los productos activos...')
  try {
    const products = await Product.find({ is_active: true })
    console.log(`✅ Se encontraron ${products.length} productos`)
    res.json(products)
  } catch (error) {
    console.error('❌ Error al obtener productos:', error)
    res
      .status(500)
      .json({ message: 'Error al obtener productos', error: error.message })
  }
}

// Obtener un producto específico
export const getProduct = async (req, res) => {
  const { uuid } = req.params
  console.log(`🔍 Buscando producto con UUID: ${uuid}`)
  try {
    const product = await Product.findOne({ uuid, is_active: true })
    if (!product) {
      console.log('❌ Producto no encontrado')
      return res.status(404).json({ message: 'Producto no encontrado' })
    }
    console.log('✅ Producto encontrado:', product.name)
    res.json(product)
  } catch (error) {
    console.error('❌ Error al obtener el producto:', error)
    res
      .status(500)
      .json({ message: 'Error al obtener el producto', error: error.message })
  }
}

// Crear nuevo producto
export const createProduct = async (req, res) => {
  const {
    sku,
    name,
    description,
    type,
    is_service,
    category_id,
    brand_id,
    location_id,
    barcodes,
    base_unit,
    stack_config,
    pack_config,
    inventory,
    cost,
    profit_margin,
    price,
    wholesale_price,
    tax_rate,
    is_excluded,
    customization
  } = req.body

  console.log('📝 Creando nuevo producto:', {
    sku,
    name,
    type,
    is_service,
    category_id
  })
  try {
    // Verificar si ya existe un producto con el mismo SKU
    const existingProduct = await Product.findOne({ sku, is_active: true })
    if (existingProduct) {
      console.log('❌ Ya existe un producto con este SKU')
      return res
        .status(400)
        .json({ message: 'Ya existe un producto con este SKU' })
    }

    // Verificar si la categoría existe
    console.log(`🔍 Verificando categoría: ${category_id}`)
    const category = await Category.findOne({
      uuid: category_id,
      is_active: true
    })
    if (!category) {
      console.log('❌ Categoría no encontrada')
      return res.status(404).json({ message: 'Categoría no encontrada' })
    }

    // Verificar si la marca existe
    console.log(`🔍 Verificando marca: ${brand_id}`)
    const brand = await Brand.findOne({
      uuid: brand_id,
      is_active: true
    })
    if (!brand) {
      console.log('❌ Marca no encontrada')
      return res.status(404).json({ message: 'Marca no encontrada' })
    }

    const product = await Product.create({
      uuid: uuidv4(),
      sku,
      name,
      description,
      type,
      is_service,
      category_id,
      brand_id,
      location_id,
      barcodes,
      base_unit,
      stack_config,
      pack_config,
      inventory,
      cost,
      profit_margin,
      price,
      wholesale_price,
      tax_rate,
      is_excluded,
      customization,
      is_active: true
    })

    console.log('✅ Producto creado exitosamente:', product.name)
    res.status(201).json(product)
  } catch (error) {
    console.error('❌ Error al crear el producto:', error)
    res
      .status(500)
      .json({ message: 'Error al crear el producto', error: error.message })
  }
}

// Actualizar producto
export const updateProduct = async (req, res) => {
  const { uuid } = req.params
  const updateData = req.body

  try {
    // Verificar si el producto existe
    const product = await Product.findOne({ uuid, is_active: true })
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' })
    }

    // Si se está actualizando el SKU, verificar que no exista otro con el mismo SKU
    if (updateData.sku && updateData.sku !== product.sku) {
      const existingProduct = await Product.findOne({
        sku: updateData.sku,
        is_active: true
      })
      if (existingProduct) {
        return res
          .status(400)
          .json({ message: 'Ya existe un producto con este SKU' })
      }
    }

    // Si se está actualizando la categoría, verificar que exista
    if (updateData.category_id) {
      const category = await Category.findOne({
        uuid: updateData.category_id,
        is_active: true
      })
      if (!category) {
        return res.status(404).json({ message: 'Categoría no encontrada' })
      }
    }
    
    // Si se está actualizando la marca, verificar que exista
    if (updateData.brand_id) {
      const brand = await Brand.findOne({
        uuid: updateData.brand_id,
        is_active: true
      })
      if (!brand) {
        return res.status(404).json({ message: 'Marca no encontrada' })
      }
    }

    // Actualizar campos
    Object.assign(product, updateData)
    product.updated_at = new Date()

    await product.save()
    console.log('✅ Producto actualizado exitosamente:', product.name)
    res.json(product)
  } catch (error) {
    console.error('❌ Error al actualizar el producto:', error)
    res.status(500).json({
      message: 'Error al actualizar el producto',
      error: error.message
    })
  }
}

// Actualizar precio rápidamente
export const updatePrice = async (req, res) => {
  const { uuid } = req.params
  const { price, cost, profit_margin } = req.body
  console.log(`💰 Actualizando precios del producto ${uuid}:`, {
    price,
    cost,
    profit_margin
  })
  try {
    const product = await Product.findOne({ uuid, is_active: true })
    if (!product) {
      console.log('❌ Producto no encontrado')
      return res.status(404).json({ message: 'Producto no encontrado' })
    }

    if (price !== undefined) product.price = price
    if (cost !== undefined) product.cost = cost
    if (profit_margin !== undefined) product.profit_margin = profit_margin

    product.updated_at = new Date()
    await product.save()

    console.log('✅ Precios actualizados exitosamente:', {
      name: product.name,
      price: product.price,
      cost: product.cost,
      profit_margin: product.profit_margin
    })
    res.json(product)
  } catch (error) {
    console.error('❌ Error al actualizar el precio:', error)
    res
      .status(500)
      .json({ message: 'Error al actualizar el precio', error: error.message })
  }
}

// Actualizar stock rápidamente
export const updateStock = async (req, res) => {
  const { uuid } = req.params
  const { current_stock, minimum_stock, reorder_point } = req.body
  console.log(`📦 Actualizando stock del producto ${uuid}:`, {
    current_stock,
    minimum_stock,
    reorder_point
  })
  try {
    const product = await Product.findOne({ uuid, is_active: true })
    if (!product) {
      console.log('❌ Producto no encontrado')
      return res.status(404).json({ message: 'Producto no encontrado' })
    }

    if (product.is_service) {
      console.log('❌ No se puede actualizar el stock de un servicio')
      return res
        .status(400)
        .json({ message: 'No se puede actualizar el stock de un servicio' })
    }

    if (current_stock !== undefined)
      product.inventory.current_stock = current_stock
    if (minimum_stock !== undefined)
      product.inventory.minimum_stock = minimum_stock
    if (reorder_point !== undefined)
      product.inventory.reorder_point = reorder_point

    product.updated_at = new Date()
    await product.save()

    console.log('✅ Stock actualizado exitosamente:', {
      name: product.name,
      current_stock: product.inventory.current_stock,
      minimum_stock: product.inventory.minimum_stock,
      reorder_point: product.inventory.reorder_point
    })
    res.json(product)
  } catch (error) {
    console.error('❌ Error al actualizar el stock:', error)
    res
      .status(500)
      .json({ message: 'Error al actualizar el stock', error: error.message })
  }
}

// Eliminar producto (inteligente)
export const deleteProduct = async (req, res) => {
  const { uuid } = req.params
  console.log(`🗑️  Intentando eliminar producto: ${uuid}`)
  try {
    const product = await Product.findOne({ uuid })
    if (!product) {
      console.log('❌ Producto no encontrado')
      return res.status(404).json({ message: 'Producto no encontrado' })
    }

    // Verificar si el producto está en uso (por ejemplo, en facturas o pedidos)
    // TODO: Implementar verificación de uso en facturas/pedidos
    console.log('ℹ️  Realizando soft delete del producto')
    product.is_active = false
    product.updated_at = new Date()
    await product.save()
    console.log('✅ Producto desactivado exitosamente')
    res.json({ message: 'Producto desactivado' })
  } catch (error) {
    console.error('❌ Error al eliminar el producto:', error)
    res
      .status(500)
      .json({ message: 'Error al eliminar el producto', error: error.message })
  }
}

// Obtener productos por categoría
export const getProductsByCategory = async (req, res) => {
  const { categoryId } = req.params
  console.log(`🔍 Buscando productos de la categoría: ${categoryId}`)
  try {
    const products = await Product.find({
      category_id: categoryId,
      is_active: true
    })
    console.log(
      `✅ Se encontraron ${products.length} productos en la categoría`
    )
    res.json(products)
  } catch (error) {
    console.error('❌ Error al obtener productos por categoría:', error)
    res.status(500).json({
      message: 'Error al obtener productos por categoría',
      error: error.message
    })
  }
}

// Obtener productos de servicio
export const getServiceProducts = async (req, res) => {
  console.log('🔍 Buscando productos de servicio...')
  try {
    const products = await Product.find({
      is_service: true,
      is_active: true
    })
    console.log(`✅ Se encontraron ${products.length} productos de servicio`)
    res.json(products)
  } catch (error) {
    console.error('❌ Error al obtener productos de servicio:', error)
    res.status(500).json({
      message: 'Error al obtener productos de servicio',
      error: error.message
    })
  }
}

// Obtener productos con stock bajo
export const getLowStockProducts = async (req, res) => {
  console.log('🔍 Buscando productos con stock bajo...')
  try {
    const products = await Product.find({
      is_active: true,
      is_service: false,
      'inventory.current_stock': { $lte: '$inventory.minimum_stock' }
    })
    console.log(`✅ Se encontraron ${products.length} productos con stock bajo`)
    res.json(products)
  } catch (error) {
    console.error('❌ Error al obtener productos con stock bajo:', error)
    res.status(500).json({
      message: 'Error al obtener productos con stock bajo',
      error: error.message
    })
  }
}

// Búsqueda avanzada de productos
export const searchProducts = async (req, res) => {
  const { query, category_id, is_service, min_price, max_price, in_stock } =
    req.query
  console.log('🔍 Realizando búsqueda avanzada de productos:', req.query)
  try {
    const searchCriteria = { is_active: true }

    if (query) {
      searchCriteria.$or = [
        { name: { $regex: query, $options: 'i' } },
        { sku: { $regex: query, $options: 'i' } },
        { 'barcodes.code': { $regex: query, $options: 'i' } }
      ]
    }

    if (category_id) searchCriteria.category_id = category_id
    if (is_service !== undefined)
      searchCriteria.is_service = is_service === 'true'
    if (min_price || max_price) {
      searchCriteria.price = {}
      if (min_price) searchCriteria.price.$gte = Number(min_price)
      if (max_price) searchCriteria.price.$lte = Number(max_price)
    }
    if (in_stock === 'true') {
      searchCriteria.is_service = false
      searchCriteria['inventory.current_stock'] = { $gt: 0 }
    }

    const products = await Product.find(searchCriteria)
    console.log(`✅ Se encontraron ${products.length} productos en la búsqueda`)
    res.json(products)
  } catch (error) {
    console.error('❌ Error en la búsqueda de productos:', error)
    res
      .status(500)
      .json({
        message: 'Error en la búsqueda de productos',
        error: error.message
      })
  }
}

// Obtener estadísticas de productos
export const getProductStats = async (req, res) => {
  console.log('📊 Obteniendo estadísticas de productos...')
  try {
    const stats = {
      total_products: await Product.countDocuments({ is_active: true }),
      total_services: await Product.countDocuments({
        is_active: true,
        is_service: true
      }),
      total_physical: await Product.countDocuments({
        is_active: true,
        is_service: false
      }),
      low_stock: await Product.countDocuments({
        is_active: true,
        is_service: false,
        'inventory.current_stock': { $lte: '$inventory.minimum_stock' }
      }),
      out_of_stock: await Product.countDocuments({
        is_active: true,
        is_service: false,
        'inventory.current_stock': 0
      }),
      by_category: await Product.aggregate([
        { $match: { is_active: true } },
        { $group: { _id: '$category_id', count: { $sum: 1 } } }
      ])
    }

    console.log('✅ Estadísticas obtenidas exitosamente')
    res.json(stats)
  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error)
    res
      .status(500)
      .json({ message: 'Error al obtener estadísticas', error: error.message })
  }
}

// Importar productos desde CSV
export const importProducts = async (req, res) => {
  console.log('📥 Iniciando importación de productos...')
  try {
    const products = req.body
    console.log(`📦 Procesando ${products.length} productos para importar`)

    const results = {
      success: 0,
      failed: 0,
      errors: []
    }

    for (const productData of products) {
      try {
        // Verificar SKU único
        const existingProduct = await Product.findOne({
          sku: productData.sku,
          is_active: true
        })
        if (existingProduct) {
          results.failed++
          results.errors.push(`SKU duplicado: ${productData.sku}`)
          continue
        }

        // Verificar categoría
        const category = await Category.findOne({
          uuid: productData.category_id,
          is_active: true
        })
        if (!category) {
          results.failed++
          results.errors.push(
            `Categoría no encontrada para SKU: ${productData.sku}`
          )
          continue
        }

        // Crear producto
        await Product.create({
          uuid: uuidv4(),
          ...productData,
          is_active: true
        })
        results.success++
      } catch (error) {
        results.failed++
        results.errors.push(`Error en SKU ${productData.sku}: ${error.message}`)
      }
    }

    console.log(
      `✅ Importación completada: ${results.success} exitosos, ${results.failed} fallidos`
    )
    res.json(results)
  } catch (error) {
    console.error('❌ Error en la importación:', error)
    res
      .status(500)
      .json({ message: 'Error en la importación', error: error.message })
  }
}

// Exportar productos a CSV
export const exportProducts = async (req, res) => {
  console.log('📤 Iniciando exportación de productos...')
  try {
    const products = await Product.find({ is_active: true })
    console.log(`✅ Se exportarán ${products.length} productos`)
    res.json(products)
  } catch (error) {
    console.error('❌ Error en la exportación:', error)
    res
      .status(500)
      .json({ message: 'Error en la exportación', error: error.message })
  }
}

// Obtener historial de cambios de un producto
export const getProductHistory = async (req, res) => {
  const { uuid } = req.params
  console.log(`📜 Obteniendo historial del producto: ${uuid}`)
  try {
    // TODO: Implementar sistema de historial
    console.log('ℹ️  Sistema de historial pendiente de implementar')
    res.json({ message: 'Sistema de historial pendiente de implementar' })
  } catch (error) {
    console.error('❌ Error al obtener historial:', error)
    res
      .status(500)
      .json({ message: 'Error al obtener historial', error: error.message })
  }
}

// Validar datos de productos
export const validateProducts = async (req, res) => {
  console.log('🔍 Iniciando validación de productos...')
  try {
    const products = await Product.find({ is_active: true })
    const validationResults = {
      total: products.length,
      valid: 0,
      invalid: 0,
      errors: []
    }

    for (const product of products) {
      const errors = []

      // Validar SKU
      if (!product.sku) errors.push('SKU faltante')

      // Validar nombre
      if (!product.name) errors.push('Nombre faltante')

      // Validar categoría
      if (!product.category_id) errors.push('Categoría faltante')

      // Validar precios
      if (product.price < 0) errors.push('Precio inválido')
      if (product.cost < 0) errors.push('Costo inválido')

      // Validar inventario para productos físicos
      if (!product.is_service) {
        if (product.inventory.current_stock < 0)
          errors.push('Stock actual inválido')
        if (product.inventory.minimum_stock < 0)
          errors.push('Stock mínimo inválido')
      }

      if (errors.length > 0) {
        validationResults.invalid++
        validationResults.errors.push({
          sku: product.sku,
          name: product.name,
          errors
        })
      } else {
        validationResults.valid++
      }
    }

    console.log(
      `✅ Validación completada: ${validationResults.valid} válidos, ${validationResults.invalid} inválidos`
    )
    res.json(validationResults)
  } catch (error) {
    console.error('❌ Error en la validación:', error)
    res
      .status(500)
      .json({ message: 'Error en la validación', error: error.message })
  }
}

// Operaciones en lote
export const batchUpdate = async (req, res) => {
  const { operation, products } = req.body
  console.log(`🔄 Iniciando operación en lote: ${operation}`)
  try {
    const results = {
      success: 0,
      failed: 0,
      errors: []
    }

    for (const { uuid, data } of products) {
      try {
        const product = await Product.findOne({ uuid, is_active: true })
        if (!product) {
          results.failed++
          results.errors.push(`Producto no encontrado: ${uuid}`)
          continue
        }

        switch (operation) {
          case 'update_price':
            if (data.price !== undefined) product.price = data.price
            if (data.cost !== undefined) product.cost = data.cost
            if (data.profit_margin !== undefined)
              product.profit_margin = data.profit_margin
            break
          case 'update_stock':
            if (!product.is_service) {
              if (data.current_stock !== undefined)
                product.inventory.current_stock = data.current_stock
              if (data.minimum_stock !== undefined)
                product.inventory.minimum_stock = data.minimum_stock
            }
            break
          case 'update_category':
            if (data.category_id) {
              const category = await Category.findOne({
                uuid: data.category_id,
                is_active: true
              })
              if (!category) {
                results.failed++
                results.errors.push(
                  `Categoría no encontrada para producto: ${uuid}`
                )
                continue
              }
              product.category_id = data.category_id
            }
            break
          default:
            results.failed++
            results.errors.push(`Operación no válida: ${operation}`)
            continue
        }

        product.updated_at = new Date()
        await product.save()
        results.success++
      } catch (error) {
        results.failed++
        results.errors.push(`Error en producto ${uuid}: ${error.message}`)
      }
    }

    console.log(
      `✅ Operación en lote completada: ${results.success} exitosos, ${results.failed} fallidos`
    )
    res.json(results)
  } catch (error) {
    console.error('❌ Error en operación en lote:', error)
    res
      .status(500)
      .json({ message: 'Error en operación en lote', error: error.message })
  }
}
