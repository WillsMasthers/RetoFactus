import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'

import authRouter from './routes/auth.routes.js'
import tasksRouter from './routes/tasks.routes.js'
import factusRoutes from './routes/factus.routes.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())

app.use('/api', authRouter)
app.use('/api', tasksRouter)
app.use('/api/factus', factusRoutes)

export default app
