import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
import authenticateToken from '../middleware/auth.js'

const JWT_SECRET = process.env.JWT_SECRET

export default function authRoutes(db) {
  const router = express.Router()

  router.get('/profile', authenticateToken, (req, res) => {
    res.json({ user: req.user })
  })

  router.post('/register', async (req, res) => {
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
      console.error(err)
      res.status(500).json({ message: 'Server error' })
    }
  })

  router.post('/login', (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: 'Missing username or password' })
    }

    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' })
      }
      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' })
      }

      // Move async logic into a separate IIFE (Immediately Invoked Function Expression)
      ;(async () => {
        try {
          const passwordMatch = await bcrypt.compare(password, user.password)
          if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid username or password' })
          }

          const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
            expiresIn: '1h',
          })
          //console.log('JWT_SECRET:', token)
          res.json({ message: 'Login successful', token })
        } catch (error) {
          console.error(error)
          res.status(500).json({ message: 'Server error' })
        }
      })()
    })
  })

  return router
}
