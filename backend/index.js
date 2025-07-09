import express from 'express'
import sqlite3 from 'sqlite3'
import cors from 'cors'
const app = express()
const PORT = 4000
import authRoutes from './routes/authRoutes.js'
import dotenv from 'dotenv'
dotenv.config()
// Setup DB
const db = new sqlite3.Database('./users.db')

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT
  )`)
})

app.use(cors()) // Allow all origins for dev
app.use(express.json()) // parse JSON body
app.use('/api/auth', authRoutes(db))

// app.get('/profile', authenticateToken, (req, res) => {
//   res.json({ user: req.user })
// })

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
