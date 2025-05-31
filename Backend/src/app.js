import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import cors from 'cors'

// Importar rutas
import authRouter from './routes/auth.routes.js'
import tasksRouter from './routes/tasks.routes.js'
import factusRoutes from './routes/factus.routes.js'
import dianCatalogRoutes from './routes/dianCatalog.routes.js'
import catalogsRoutes from './routes/catalogs.routes.js'
import companyRoutes from './routes/company.routes.js'
import userRoutes from './routes/user.routes.js'

const app = express()

// Configurar CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        origin.includes('://localhost:') ||
        origin.includes('://127.0.0.1:') ||
        origin.includes('://192.168.') ||
        origin.includes('https://')
      ) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Set-Cookie', 'Content-Disposition']
  })
)

// Middleware globales
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())

// Configurar rutas
app.use('/api/auth', authRouter)
app.use('/api/tasks', tasksRouter)
app.use('/api/factus', factusRoutes)
app.use('/api/dian-catalog', dianCatalogRoutes)
app.use('/api/catalogs', catalogsRoutes)
app.use('/api/company', companyRoutes)
app.use('/api/users', userRoutes)

// Servir archivos estáticos
app.use('/api/catalogs', express.static('../shared/catalogs'))

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})

export default app
