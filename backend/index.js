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

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         username TEXT UNIQUE,
         email TEXT UNIQUE,
         password TEXT,
         created_at TEXT DEFAULT (datetime('now'))
    )`)
})

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS time_blocks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    start_time TEXT,
    end_time TEXT
  )`)
})

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`)
})

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    customerId INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customerId) REFERENCES customers(id)
  )`)
})

app.use(cors()) // Allow all origins for dev
app.use(express.json()) // parse JSON body
app.use('/api/auth', authRoutes(db))
app.use('/api/time', timeRoutes)
app.use('/api', customerRoutes(db))
app.use('/api', projectRoutes(db))

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
