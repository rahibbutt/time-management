import express from 'express'
import { authenticateToken, checkAdminRole } from '../middleware/auth.js'

export default function projectRoutes(db) {
  const router = express.Router()

  // GET all projects with their associated customer name
  router.get('/admin/project', authenticateToken, (req, res) => {
    const query = `
      SELECT projects.*, customers.name as customerName
      FROM projects
      LEFT JOIN customers ON projects.customerId = customers.id
    `
    db.all(query, [], (err, rows) => {
      if (err) {
        console.error(err)
        return res.status(500).json({ message: 'Database error' })
      }
      res.json(rows)
    })
  })

  // CREATE a new project
  router.post('/admin/project', authenticateToken, checkAdminRole, (req, res) => {
    const { name, description, customerId } = req.body

    if (!name || !customerId) {
      return res.status(400).json({ message: 'Project name and customerId are required' })
    }

    db.run(
      'INSERT INTO projects (name, description, customerId) VALUES (?, ?, ?)',
      [name, description || '', customerId],
      function (err) {
        if (err) {
          console.error(err)
          return res.status(500).json({ message: 'Database error' })
        }

        db.get(`SELECT * FROM customers WHERE id = ?`, [customerId], (err, customer) => {
          if (err) {
            console.error(err)
            return res.status(500).json({ message: 'Database error' })
          }

          res
            .status(201)
            .json({ id: this.lastID, name, description, customerId, customerName: customer.name })
        })
      },
    )
  })

  // UPDATE a project
  router.put('/admin/project/:id', authenticateToken, checkAdminRole, (req, res) => {
    const { id } = req.params
    const { name, description, customerId } = req.body

    if (!name || !customerId) {
      return res.status(400).json({ message: 'Project name and customerId are required' })
    }

    db.run(
      'UPDATE projects SET name = ?, description = ?, customerId = ? WHERE id = ?',
      [name, description || '', customerId, id],
      function (err) {
        if (err) {
          console.error(err)
          return res.status(500).json({ message: 'Database error' })
        }

        if (this.changes === 0) {
          return res.status(404).json({ message: 'Project not found' })
        }

        // Fetch project with customer name
        const query = `
        SELECT projects.*, customers.name as customerName
        FROM projects
        LEFT JOIN customers ON projects.customerId = customers.id
        WHERE projects.id = ?
      `

        db.get(query, [id], (err, row) => {
          if (err) {
            console.error(err)
            return res.status(500).json({ message: 'Database error' })
          }

          res.json(row)
        })
      },
    )
  })

  // DELETE a project
  router.delete('/admin/project/:id', authenticateToken, checkAdminRole, (req, res) => {
    const { id } = req.params

    db.run('DELETE FROM projects WHERE id = ?', [id], function (err) {
      if (err) {
        console.error(err)
        return res.status(500).json({ message: 'Database error' })
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Project not found' })
      }
      res.json({ message: 'Project deleted' })
    })
  })

  return router
}
