import { Router } from 'express'
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updatePrice,
  updateStock,
  getProductsByCategory,
  getServiceProducts,
  getLowStockProducts,
  searchProducts,
  getProductStats,
  importProducts,
  exportProducts,
  getProductHistory,
  validateProducts,
  batchUpdate
} from '../controllers/product.controller.js'

const router = Router()

// Rutas básicas de productos
router.get('/', getProducts)
router.get('/:uuid', getProduct)
router.post('/', createProduct)
router.put('/:uuid', updateProduct)
router.delete('/:uuid', deleteProduct)

// Rutas de actualización rápida
router.patch('/:uuid/price', updatePrice)
router.patch('/:uuid/stock', updateStock)

// Rutas de filtrado
router.get('/category/:categoryId', getProductsByCategory)
router.get('/service', getServiceProducts)
router.get('/stock/low', getLowStockProducts)

// Rutas de búsqueda y estadísticas
router.get('/search', searchProducts)
router.get('/stats', getProductStats)

// Rutas de importación/exportación
router.post('/import', importProducts)
router.get('/export', exportProducts)

// Rutas de validación y auditoría
router.get('/:uuid/history', getProductHistory)
router.get('/validate', validateProducts)

// Rutas de operaciones en lote
router.post('/batch', batchUpdate)

export default router
