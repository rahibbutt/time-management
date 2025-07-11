import express from 'express'
import { authenticateToken, checkAdminRole } from '../middleware/auth.js'

export default function customerRoutes(db) {
  const router = express.Router()

  router.get('/admin/customer', authenticateToken, checkAdminRole, (req, res) => {
    db.all('SELECT * FROM customers', [], (err, rows) => {
      if (err) {
        console.error(err)
        return res.status(500).json({ message: 'Database error' })
      }
      res.json(rows)
    })
  })

  router.post('/admin/customer', authenticateToken, checkAdminRole, (req, res) => {
    const { name, email, phone } = req.body
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' })
    }

    db.run(
      'INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)',
      [name, email, phone || ''],
      function (err) {
        if (err) {
          console.error(err)
          return res.status(500).json({ message: 'Database error' })
        }
        res.status(201).json({ id: this.lastID, name, email, phone })
      },
    )
  })

  router.put('/admin/customer/:id', authenticateToken, checkAdminRole, (req, res) => {
    const { id } = req.params
    const { name, email, phone } = req.body

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' })
    }

    db.run(
      'UPDATE customers SET name = ?, email = ?, phone = ? WHERE id = ?',
      [name, email, phone || '', id],
      function (err) {
        if (err) {
          console.error(err)
          return res.status(500).json({ message: 'Database error' })
        }
        if (this.changes === 0) {
          return res.status(404).json({ message: 'Customer not found' })
        }
        res.json({ id, name, email, phone })
      },
    )
  })

  router.delete('/admin/customer/:id', authenticateToken, checkAdminRole, (req, res) => {
    const { id } = req.params

    db.run('DELETE FROM customers WHERE id = ?', [id], function (err) {
      if (err) {
        console.error(err)
        return res.status(500).json({ message: 'Database error' })
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Customer not found' })
      }
      res.json({ message: 'Customer deleted' })
    })
  })

  return router
}
