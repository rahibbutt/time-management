import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Setup DB (reuse your existing sqlite db connection)
import sqlite3 from 'sqlite3'
const db = new sqlite3.Database('./users.db')

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS time_blocks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    start_time TEXT,
    end_time TEXT
  )`)
})

router.post('/', authenticateToken, (req, res) => {
  const { startTime, endTime } = req.body
  db.run(
    'INSERT INTO time_blocks (user_id, start_time, end_time) VALUES (?, ?, ?)',
    [req.user.id, startTime, endTime],
    function (err) {
      if (err) {
        console.error(err)
        return res.status(500).json({ message: 'Failed to save time block' })
      }
      res.status(201).json({ message: 'Time block saved' })
    },
  )
})

router.get('/', authenticateToken, (req, res) => {
  db.all(
    'SELECT id, start_time AS startTime, end_time AS endTime FROM time_blocks WHERE user_id = ?',
    [req.user.id],
    (err, rows) => {
      if (err) {
        console.error(err)
        return res.status(500).json({ message: 'Failed to fetch time blocks' })
      }
      res.json(rows)
    },
  )
})

router.put('/:id', authenticateToken, (req, res) => {
  const { id } = req.params
  const { endTime } = req.body

  db.run(
    'UPDATE time_blocks SET end_time = ? WHERE id = ? AND user_id = ?',
    [endTime, id, req.user.id],
    function (err) {
      if (err) {
        console.error(err)
        return res.status(500).json({ message: 'Failed to update time block' })
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Time block not found or unauthorized' })
      }
      res.json({ message: 'Time block updated' })
    },
  )
})

export default router
