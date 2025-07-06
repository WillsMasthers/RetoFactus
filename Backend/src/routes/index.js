import { Router } from 'express'
import categoryRoutes from './category.routes.js'
import productRoutes from './product.routes.js'
import authRoutes from './auth.routes.js'
import userRoutes from './user.routes.js'
import companyRoutes from './company.routes.js'
import catalogRoutes from './catalog.routes.js'
import catalogsRoutes from './catalogs.routes.js'
import dianCatalogRoutes from './dianCatalog.routes.js'
import billRoutes from './bill.routes.js'
import billsRoutes from './bills.ts'
import tasksRoutes from './tasks.routes.js'
import factusRoutes from './factus.routes.js'

const router = Router()

// Rutas de autenticación y usuarios
router.use('/auth', authRoutes)
router.use('/users', userRoutes)

// Rutas de catálogos
router.use('/categories', categoryRoutes)
router.use('/brands', brandRoutes)
router.use('/products', productRoutes)

// Rutas de empresa y catálogos
router.use('/company', companyRoutes)
router.use('/catalog', catalogRoutes)
router.use('/catalogs', catalogsRoutes)
router.use('/dian-catalog', dianCatalogRoutes)

// Rutas de facturas y tareas
router.use('/bills', billsRoutes)
router.use('/bill', billRoutes)
router.use('/tasks', tasksRoutes)
router.use('/factus', factusRoutes)

export default router
