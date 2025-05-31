import { Router } from 'express'
import authRoutes from './auth.routes.js'
import dianCatalogRoutes from './dianCatalog.routes.js'
import companyRoutes from './company.routes.js'
import catalogsRoutes from './catalogs.routes.js'

const router = Router()

// Rutas de autenticación
router.use('/auth', authRoutes)

// Rutas de catálogos DIAN
router.use('/catalogs', dianCatalogRoutes)

// Rutas de empresa
router.use('/company', companyRoutes)

// Rutas de catálogos
router.use('/catalogs', catalogsRoutes)

export default router
