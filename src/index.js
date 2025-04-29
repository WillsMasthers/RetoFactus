import app from './app.js'
import { connectDB } from './db.js'
import { PORT } from './config.js'

async function startServer() {
  try {
    // Primero conectar a MongoDB
    await connectDB()

    // Solo iniciar el servidor si la conexión a MongoDB fue exitosa
    app.listen(PORT, () => {
      console.log('Servidor iniciado en el puerto', PORT)
    })
  } catch (error) {
    console.error('Error al iniciar el servidor:', error)
    process.exit(1)
  }
}

startServer()
