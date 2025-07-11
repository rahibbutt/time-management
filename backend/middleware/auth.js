import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
const JWT_SECRET = process.env.JWT_SECRET
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Token missing' })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' })
    }
    req.user = user
    //console.log('Decoded JWT user:', user)
    next()
  })
}
const checkAdminRole = (req, res, next) => {
  //console.log('User role in checkAdminRole:', req.user.role)
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admins only' })
  }
  next()
}

export { authenticateToken, checkAdminRole }
