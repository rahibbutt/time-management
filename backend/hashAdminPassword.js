// Run this script once to hash admin password and stored it manually inside the database
import bcrypt from 'bcrypt'

const password = 'your_password'
const saltRounds = 10

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err)
  } else {
    console.log('Hashed password:', hash)
  }
})
