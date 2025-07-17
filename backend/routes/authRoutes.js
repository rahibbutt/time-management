import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
import { authenticateToken, checkAdminRole } from '../middleware/auth.js'
const JWT_SECRET = process.env.JWT_SECRET

export default function authRoutes(db) {
  const router = express.Router()

  router.get('/admin/dashboard', authenticateToken, checkAdminRole, (req, res) => {
    res.json({ message: 'Welcome to Admin Dashboard' })
  })

  router.get('/profile', authenticateToken, (req, res) => {
    db.get(
      'SELECT id, username, email, role, created_at as createdAt FROM users WHERE id = ?',
      [req.user.id],
      (err, row) => {
        if (err) {
          console.error(err)
          return res.status(500).json({ message: 'Database error' })
        }
        if (!row) {
          return res.status(404).json({ message: 'User not found' })
        }
        res.json({ user: row })
      },
    )
  })

  router.post('/register', async (req, res) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10)
      // Format createdAt as 'YYYY-MM-DD HH:mm:ss'
      const createdAt = new Date().toISOString().replace('T', ' ').substring(0, 19)

      db.run(
        'INSERT INTO users (username, email, password, role, created_at) VALUES (?, ?, ?, ?, ?)',
        [username, email, hashedPassword, 'user', createdAt],
        function (err) {
          if (err) {
            if (err.message.includes('UNIQUE constraint')) {
              return res.status(400).json({ message: 'Username or email already exists' })
            }
            return res.status(500).json({ message: 'Database error' })
          }

          // JWT payload includes user ID, username, role
          const token = jwt.sign({ id: this.lastID, username, role: 'user' }, JWT_SECRET, {
            expiresIn: '1h',
          })

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

      ;(async () => {
        try {
          const passwordMatch = await bcrypt.compare(password, user.password)
          if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid username or password' })
          }

          // Generate JWT with role included
          const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' },
          )

          res.json({
            message: 'Login successful',
            token,
            role: user.role,
          })
        } catch (error) {
          console.error(error)
          res.status(500).json({ message: 'Server error' })
        }
      })()
    })
  })

  return router
}
