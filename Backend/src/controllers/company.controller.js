import Company from '../models/company.model.js'
import User from '../models/user.model.js'

export async function getCompaniesByUser(req, res) {
  try {
    const userId = req.user.id

    // Buscar todas las empresas del usuario
    const companies = await Company.find({
      $or: [{ administrador: userId }, { usuarios: userId }]
    }).populate('administrador', 'username firstName lastName')

    if (!companies || companies.length === 0) {
      return res.status(200).json({
        success: true,
        companies: []
      })
    }

    return res.status(200).json({
      success: true,
      companies
    })
  } catch (error) {
    console.error('Error al obtener la empresa:', error)
    return res.status(500).json({
      success: false,
      message: 'Error al obtener la empresa'
    })
  }
}

export async function createCompany(req, res) {
  try {
    const userId = req.user.id
    const companyData = req.body

    // Validar campos requeridos
    const requiredFields = [
      'identification.nit',
      'name.company',
      'location.address',
      'location.country',
      'identification.document_type'
    ]
    
    const missingFields = requiredFields.filter(field => {
      const value = field.split('.').reduce((obj, key) => obj && obj[key], companyData)
      return value === undefined || value === null || value === ''
    })

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Faltan campos requeridos: ${missingFields.join(', ').replace(/\./g, ' -> ')}`
      })
    }

    // Si el país no es Colombia, permitir que departamento y ciudad estén vacíos
    if (companyData.location?.country !== 'CO') {
      // Eliminar departamento y ciudad si están vacíos
      if (!companyData.location?.department) delete companyData.location.department
      if (!companyData.location?.municipality) delete companyData.location.municipality
    } else {
      // Para Colombia, departamento y municipio son requeridos
      if (!companyData.location?.department || !companyData.location?.municipality) {
        return res.status(400).json({
          success: false,
          message: 'Para Colombia, departamento y municipio son requeridos'
        })
      }
    }

    // Preparar datos de la empresa con la nueva estructura
    const companyDataWithStructure = {
      identification: {
        nit: companyData.identification?.nit,
        dv: companyData.identification?.dv || '',
        document_type: companyData.identification?.document_type || 'NIT'
      },
      name: {
        company: companyData.name?.company,
        commercial: companyData.name?.commercial || companyData.name?.company,
        graphic_representation: companyData.name?.graphic_representation || companyData.name?.company,
        registration: {
          code: companyData.name?.registration?.code || '',
          economic_activity: companyData.name?.registration?.economic_activity || ''
        }
      },
      contact: {
        email: companyData.contact?.email || '',
        phone: companyData.contact?.phone || ''
      },
      location: {
        country: companyData.location?.country,
        department: companyData.location?.department,
        municipality: companyData.location?.municipality,
        address: companyData.location?.address,
        postal_code: companyData.location?.postal_code
      },
      logo: {
        url: companyData.logo?.url || ''
      },
      billing_config: companyData.billing_config || {
        invoice_prefix: 'FACT',
        invoice_resolution: '',
        invoice_start_number: 1,
        invoice_end_number: 1000,
        invoice_current_number: 1,
        invoice_notes: '',
        payment_terms: 'CONTADO',
        payment_methods: [],
        taxes: []
      },
      is_active: companyData.is_active !== undefined ? companyData.is_active : true,
      administrador: userId,
      usuarios: [userId] // Agregar el usuario al array de usuarios
    }

    // Crear la empresa con la estructura actualizada
    const company = new Company(companyDataWithStructure)

    const savedCompany = await company.save()

    // Verificar si el usuario existe
    const user = await User.findById(userId)
    if (!user) {
      // Si el usuario no existe, eliminar la empresa recién creada
      await Company.findByIdAndDelete(savedCompany._id)
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      })
    }

    // Actualizar el usuario para incluir la nueva empresa
    const updateData = {
      $addToSet: {
        empresas: {
          empresa: savedCompany._id,
          rol: 'admin',
          activo: true
        }
      }
    }

    // Si es la primera empresa, establecerla como empresa actual
    if (!user.empresa_actual) {
      updateData.empresa_actual = savedCompany._id
    }

    // Realizar la actualización
    await User.findByIdAndUpdate(userId, updateData, { new: true })

    const populatedCompany = await Company.findById(savedCompany._id)
      .populate('administrador', 'username firstName lastName')
      .populate('usuarios', 'username firstName lastName')

    return res.status(201).json({
      success: true,
      company: populatedCompany
    })
  } catch (error) {
    console.error('Error al crear la empresa:', {
      error: error,
      message: error.message,
      stack: error.stack
    })
    return res.status(500).json({
      success: false,
      message: 'Error al crear la empresa',
      error: error.message
    })
  }
}

export async function getCompanyById(req, res) {
  try {
    const companyId = req.params.id;
    const userId = req.user.id;

    // Primero verificar si la empresa existe
    const companyExists = await Company.findById(companyId);
    if (!companyExists) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada'
      });
    }

    // Luego verificar permisos
    const hasAccess = (
      companyExists.administrador.toString() === userId.toString() ||
      companyExists.usuarios.some(u => u.toString() === userId.toString())
    );

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para acceder a esta empresa'
      });
    }

    // Si tiene acceso, poblar y devolver la empresa
    const populatedCompany = await Company.findById(companyId)
      .populate('administrador', 'username firstName lastName')
      .populate('usuarios', 'username firstName lastName');

    return res.status(200).json({
      success: true,
      company: populatedCompany
    });

  } catch (error) {
    console.error('Error al obtener la empresa:', {
      error: error.message,
      stack: error.stack
    });
    return res.status(500).json({
      success: false,
      message: 'Error al obtener la empresa',
      error: error.message
    });
  }
}

export async function updateCompany(req, res) {
  try {
    const companyId = req.params.id
    const companyData = req.body

    // Verificar si existe la empresa
    const company = await Company.findById(companyId)
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró empresa'
      })
    }

    // Verificar si el usuario es el administrador de la empresa
    if (company.administrador.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Solo el administrador puede actualizar esta empresa'
      })
    }

    // Actualizar los campos de la empresa
    Object.assign(company, companyData)
    await company.save()

    // Obtener la empresa actualizada con datos poblados
    const updatedCompany = await Company.findById(companyId)
      .populate('administrador', 'username firstName lastName')
      .populate('usuarios', 'username firstName lastName')

    return res.status(200).json({
      success: true,
      company: updatedCompany
    })
  } catch (error) {
    console.error('Error al actualizar la empresa:', error)
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar la empresa',
      error: error.message
    })
  }
}

export async function deleteCompany(req, res) {
  try {
    const companyId = req.params.id
    const userId = req.user.id

    // Verificar si existe la empresa
    const company = await Company.findById(companyId)
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada'
      })
    }

    // Solo el administrador puede eliminar la empresa
    if (company.administrador.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para eliminar esta empresa'
      })
    }

    // Marcar como inactiva en lugar de eliminar (soft delete)
    company.activo = false
    await company.save()

    // Remover la empresa de los usuarios
    await User.updateMany(
      { 'empresas.empresa': companyId },
      { $pull: { empresas: { empresa: companyId } } }
    )

    return res.status(200).json({
      success: true,
      message: 'Empresa eliminada correctamente'
    })
  } catch (error) {
    console.error('Error al eliminar la empresa:', error)
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar la empresa',
      error: error.message
    })
  }
}

export async function getCompanyUsers(req, res) {
  try {
    const companyId = req.params.id
    const userId = req.user.id

    // Verificar si el usuario tiene acceso a la empresa
    const hasAccess = await Company.findOne({
      _id: companyId,
      $or: [{ administrador: userId }, { usuarios: userId }]
    })

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para ver los usuarios de esta empresa'
      })
    }

    // Obtener usuarios de la empresa con sus roles
    const company = await Company.findById(companyId)
      .populate({
        path: 'usuarios',
        select: 'username firstName lastName email',
        match: { 'empresas.empresa': companyId },
        populate: {
          path: 'empresas',
          match: { empresa: companyId },
          select: 'rol activo'
        }
      })
      .populate('administrador', 'username firstName lastName email')

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada'
      })
    }

    // Formatear la respuesta
    const users = company.usuarios.map((user) => ({
      id: user._id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      rol: user.empresas[0]?.rol || 'usuario',
      activo: user.empresas[0]?.activo || false
    }))

    // Agregar el administrador si no está en la lista
    if (
      !users.some(
        (u) => u.id.toString() === company.administrador._id.toString()
      )
    ) {
      users.unshift({
        id: company.administrador._id,
        username: company.administrador.username,
        firstName: company.administrador.firstName,
        lastName: company.administrador.lastName,
        email: company.administrador.email,
        rol: 'admin',
        activo: true
      })
    }

    return res.status(200).json({
      success: true,
      users
    })
  } catch (error) {
    console.error('Error al obtener usuarios de la empresa:', error)
    return res.status(500).json({
      success: false,
      message: 'Error al obtener los usuarios de la empresa',
      error: error.message
    })
  }
}

export async function addUserToCompany(req, res) {
  try {
    const companyId = req.params.id
    const { userId, rol = 'usuario' } = req.body
    const currentUserId = req.user.id

    // Validar rol
    const validRoles = ['admin', 'usuario', 'contador']
    if (!validRoles.includes(rol)) {
      return res.status(400).json({
        success: false,
        message:
          'Rol no válido. Los roles válidos son: admin, usuario, contador'
      })
    }

    // Verificar si existe la empresa y si el usuario actual es administrador
    const company = await Company.findById(companyId)
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada'
      })
    }

    if (company.administrador.toString() !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: 'Solo el administrador puede agregar usuarios a la empresa'
      })
    }

    // Verificar si el usuario a agregar existe
    const userToAdd = await User.findById(userId)
    if (!userToAdd) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      })
    }

    // Verificar si el usuario ya está en la empresa
    const userInCompany = await User.findOne({
      _id: userId,
      'empresas.empresa': companyId
    })

    if (userInCompany) {
      return res.status(400).json({
        success: false,
        message: 'El usuario ya pertenece a esta empresa'
      })
    }

    // Agregar el usuario a la empresa
    await User.findByIdAndUpdate(userId, {
      $addToSet: {
        empresas: {
          empresa: companyId,
          rol,
          activo: true
        }
      }
    })

    // Agregar el usuario al array de usuarios de la empresa
    await Company.findByIdAndUpdate(companyId, {
      $addToSet: { usuarios: userId }
    })

    // Obtener el usuario actualizado
    const updatedUser = await User.findById(userId)
      .select('username firstName lastName email')
      .lean()

    return res.status(200).json({
      success: true,
      message: 'Usuario agregado a la empresa correctamente',
      user: {
        ...updatedUser,
        rol,
        activo: true
      }
    })
  } catch (error) {
    console.error('Error al agregar usuario a la empresa:', error)
    return res.status(500).json({
      success: false,
      message: 'Error al agregar usuario a la empresa',
      error: error.message
    })
  }
}

export async function removeUserFromCompany(req, res) {
  try {
    const { companyId, userId } = req.params
    const currentUserId = req.user.id

    // Verificar si existe la empresa y si el usuario actual es administrador
    const company = await Company.findById(companyId)
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada'
      })
    }

    // Solo el administrador puede eliminar usuarios
    if (company.administrador.toString() !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: 'Solo el administrador puede eliminar usuarios de la empresa'
      })
    }

    // No permitir eliminar al administrador
    if (company.administrador.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: 'No puedes eliminar al administrador de la empresa'
      })
    }

    // Verificar si el usuario a eliminar existe
    const userToRemove = await User.findById(userId)
    if (!userToRemove) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      })
    }

    // Eliminar la empresa del array de empresas del usuario
    await User.findByIdAndUpdate(userId, {
      $pull: { empresas: { empresa: companyId } }
    })

    // Eliminar el usuario del array de usuarios de la empresa
    await Company.findByIdAndUpdate(companyId, {
      $pull: { usuarios: userId }
    })

    return res.status(200).json({
      success: true,
      message: 'Usuario eliminado de la empresa correctamente'
    })
  } catch (error) {
    console.error('Error al eliminar usuario de la empresa:', error)
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar usuario de la empresa',
      error: error.message
    })
  }
}

export async function updateUserRole(req, res) {
  try {
    const { companyId, userId } = req.params
    const { rol } = req.body
    const currentUserId = req.user.id

    // Validar rol
    const validRoles = ['admin', 'usuario', 'contador']
    if (!validRoles.includes(rol)) {
      return res.status(400).json({
        success: false,
        message:
          'Rol no válido. Los roles válidos son: admin, usuario, contador'
      })
    }

    // Verificar si existe la empresa y si el usuario actual es administrador
    const company = await Company.findById(companyId)
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada'
      })
    }

    // Solo el administrador puede actualizar roles
    if (company.administrador.toString() !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: 'Solo el administrador puede actualizar roles'
      })
    }

    // No permitir cambiar el rol del administrador
    if (company.administrador.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: 'No puedes cambiar el rol del administrador'
      })
    }

    // Verificar si el usuario existe y pertenece a la empresa
    const user = await User.findOne({
      _id: userId,
      'empresas.empresa': companyId
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado en esta empresa'
      })
    }

    // Actualizar el rol del usuario en la empresa
    await User.updateOne(
      { _id: userId, 'empresas.empresa': companyId },
      { $set: { 'empresas.$.rol': rol } }
    )

    // Obtener el usuario actualizado
    const updatedUser = await User.findById(userId)
      .select('username firstName lastName email')
      .lean()

    return res.status(200).json({
      success: true,
      message: 'Rol de usuario actualizado correctamente',
      user: {
        ...updatedUser,
        rol,
        activo: true
      }
    })
  } catch (error) {
    console.error('Error al actualizar rol de usuario:', error)
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar el rol del usuario',
      error: error.message
    })
  }
}
