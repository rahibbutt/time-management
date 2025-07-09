import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import sqlite3 from 'sqlite3'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const PORT = 4000
const JWT_SECRET = process.env.JWT_SECRET

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

// Register endpoint
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    db.run(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint')) {
            return res.status(400).json({ message: 'Username or email already exists' })
          }
          return res.status(500).json({ message: 'Database error' })
        }

        const token = jwt.sign({ id: this.lastID, username }, JWT_SECRET, { expiresIn: '1h' })

        res.status(201).json({ message: 'User registered', token })
      },
    )
  } catch (err) {
    console.error(err) // log for debugging
    res.status(500).json({ message: 'Server error' })
  }
})

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: 'Missing username or password' })
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' })
    }
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid username or password' })
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '1h',
    })
    res.json({ message: 'Login successful', token })
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
