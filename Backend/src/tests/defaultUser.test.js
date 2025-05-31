import mongoose from 'mongoose'
import User from '../models/user.model.js'
import { generateSalt, hashPassword } from '../controllers/auth.Controller.js'

// Conexión a la base de datos
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/retofactus', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};

export const testDefaultUser = async () => {
  try {
    // Conectar a la base de datos
    await connectDB()
    console.log('MongoDB conectado para test')

    // Verificar si ya existe el usuario admin
    const existingUser = await User.findOne({ username: 'admin' })
    if (existingUser) {
      console.log('El usuario admin ya existe')
      return existingUser
    }

    // Crear usuario por defecto
    const salt = generateSalt()
    const passwordHash = hashPassword('admin123', salt)

    const usuarioPorDefecto = await User.create({
      username: 'admin',
      password: passwordHash,
      salt,
      firstName: 'SUDO',
      lastName: 'ADMINISTRADOR',
      rol: 'admin',
      rol_global: 'super_admin',
      activo: true,
      email: 'admin@retofactus.com'
    })

    console.log('Usuario por defecto creado:', usuarioPorDefecto.username)
    return usuarioPorDefecto
  } catch (error) {
    console.error('Error en test de usuario por defecto:', error)
    throw error
  } finally {
    // Cerrar la conexión a la base de datos
    await mongoose.connection.close()
    console.log('Conexión a MongoDB cerrada')
  }
}

// Ejecutar el test si se llama directamente
if (import.meta.url.includes('defaultUser.test.js')) {
  testDefaultUser()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Error en el test:', error)
      process.exit(1)
    })
}
