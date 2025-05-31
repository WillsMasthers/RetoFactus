import User from '../models/user.model.js'

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params
    
    const user = await User.findById(id)
      .select('username firstName lastName email rol rol_global empresas empresa_actual')
      .populate('empresas.empresa', 'razon_social nit direccion telefono email')
      .populate('empresa_actual', 'razon_social nit')
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      })
    }
    
    // Formatear la respuesta
    const response = {
      id: user._id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      rol: user.rol,
      rol_global: user.rol_global,
      empresas: user.empresas.map(e => ({
        empresa: e.empresa,
        rol: e.rol,
        activo: e.activo
      })),
      empresa_actual: user.empresa_actual
    }
    
    res.json({
      success: true,
      user: response
    })
  } catch (error) {
    console.error('Error al obtener usuario por ID:', error)
    res.status(500).json({
      success: false,
      message: 'Error al obtener el usuario'
    })
  }
}
