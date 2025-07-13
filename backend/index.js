import express from 'express'
import sqlite3 from 'sqlite3'
import cors from 'cors'
const app = express()
const PORT = 4000
import dotenv from 'dotenv'
dotenv.config()
const db = new sqlite3.Database('./users.db')
import authRoutes from './routes/authRoutes.js'
import timeRoutes from './routes/timeRoutes.js'
import customerRoutes from './routes/customerRoutes.js'
import projectRoutes from './routes/projectRoutes.js'

app.use(cors()) // Allow all origins for dev
app.use(express.json()) // parse JSON body
app.use('/api/auth', authRoutes(db))
app.use('/api/time', timeRoutes)
app.use('/api', customerRoutes(db))
app.use('/api', projectRoutes(db))

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
