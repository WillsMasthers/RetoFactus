import { Router } from 'express'
import { catalogsController } from '../controllers/catalogs.controller.js'

const router = Router()

// Rutas públicas para catálogos
router.get('/departamentos', catalogsController.getDepartamentos)
router.get('/municipios/:department', catalogsController.getMunicipios)
router.get('/:tipo', catalogsController.getCatalogosByTipo)

export default router
