import express from 'express'
import { validateToken } from '../middlewares/validateToken.js'
import { 
  getCompaniesByUser, 
  getCompanyById,
  createCompany, 
  updateCompany,
  deleteCompany,
  getCompanyUsers,
  addUserToCompany,
  removeUserFromCompany,
  updateUserRole
} from '../controllers/company.controller.js'

const router = express.Router()

// Rutas protegidas por autenticación
router.use(validateToken)

// Obtener todas las empresas del usuario
router.get('/', getCompaniesByUser)

// Obtener empresa por ID
router.get('/:id', getCompanyById)

// Crear nueva empresa
router.post('/', createCompany)

// Actualizar empresa
router.put('/:id', updateCompany)

// Eliminar empresa (soft delete)
router.delete('/:id', deleteCompany)

// Obtener usuarios de la empresa
router.get('/:id/users', getCompanyUsers)

// Agregar usuario a la empresa
router.post('/:id/users', addUserToCompany)

// Eliminar usuario de la empresa
router.delete('/:id/users/:userId', removeUserFromCompany)

// Actualizar rol de usuario en la empresa
router.put('/:id/users/:userId/role', updateUserRole)

export default router
