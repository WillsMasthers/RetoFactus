import { Router } from 'express'
import {
  cargarCatalogosDIAN,
  getCatalogosByTipo,
  getCatalogoByCodigo,
  verificarVersionCatalogos
} from '../controllers/dianCatalog.controller.js'

const router = Router()

// Ruta para cargar los catálogos iniciales (solo una vez)
router.post('/cargar', cargarCatalogosDIAN)

// Ruta para obtener todos los catálogos de un tipo específico
router.get('/:tipo', getCatalogosByTipo)

// Ruta para obtener un catálogo específico por su código
router.get('/:tipo/:codigo', getCatalogoByCodigo)

// Ruta para verificar si hay una nueva versión de los catálogos
router.get('/:tipo/version', verificarVersionCatalogos)

export default router
