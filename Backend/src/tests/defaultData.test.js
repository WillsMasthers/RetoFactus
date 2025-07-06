import mongoose from 'mongoose'
import { Category } from '../models/category.model.js'
import { Product } from '../models/product.model.js'
import { v4 as uuidv4 } from 'uuid'
import assert from 'assert'

const MONGODB_URI = 'mongodb://localhost:27017/retofactus'

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('MongoDB conectado para test')
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error)
    process.exit(1)
  }
}

async function createDefaultData() {
  try {
    await connectDB()
    console.log('🚀 Iniciando creación/actualización de datos por defecto...')

    // Crear o actualizar categoría
    let category = await Category.findOne({ name: 'Generico' })

    if (!category) {
      console.log('📝 Creando nueva categoría "Generico"...')
      category = await Category.create({
        uuid: uuidv4(),
        name: 'Generico',
        level: 1,
        path: 'Generico',
        customization: {
          color: '#4CAF50',
          icon: 'category'
        }
      })
      console.log('✅ Categoría "Generico" creada exitosamente')
    } else {
      console.log(
        '📝 Actualizando categoría existente a "Categoria Generica"...'
      )
      category.name = 'Categoria Generica'
      await category.save()
      console.log('✅ Categoría actualizada exitosamente')
    }

    // Crear o actualizar producto
    const existingProduct = await Product.findOne({ sku: 'GEN-001' })

    if (!existingProduct) {
      console.log('📝 Creando nuevo producto genérico...')
      await Product.create({
        uuid: uuidv4(),
        sku: 'GEN-001',
        name: 'ProductoGenerico',
        description:
          'Producto genérico que sirve como referencia cuando no se encuentra un producto específico',
        type: 'SIMPLE',
        is_service: true,
        category_id: category.uuid,
        base_unit: {
          unit_measure_id: 1,
          name: 'Unidad'
        },
        cost: 0,
        profit_margin: 0,
        price: 0
      })
      console.log('✅ Producto genérico creado exitosamente')
    } else {
      console.log(
        '🟡 Ya existe un producto con el SKU "GEN-001". No se realizó ninguna acción.'
      )
    }

    console.log('✅ Proceso finalizado.')
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await mongoose.connection.close()
    console.log('Conexión a MongoDB cerrada')
  }
}

createDefaultData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error en el test:', error)
    process.exit(1)
  })
