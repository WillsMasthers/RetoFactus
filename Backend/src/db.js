import mongoose from 'mongoose'
import { MONGODB_URI } from './config.js'

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Tiempo de espera para la selección del servidor
      socketTimeoutMS: 45000 // Tiempo de espera para operaciones
    })
    console.log(`MongoDB conectado: ${conn.connection.host}`)

    // Manejar errores después de la conexión inicial
    mongoose.connection.on('error', (err) => {
      console.error('Error de MongoDB:', err)
    })

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB desconectado')
    })
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error)
    process.exit(1) // Terminar el proceso si no se puede conectar a MongoDB
  }
}
