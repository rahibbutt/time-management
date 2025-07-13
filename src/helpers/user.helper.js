export const isUserLoggedIn = (user) => {
  if (!user) {
    return false
  }

  return true
}

export const isAdmin = (user) => {
  return user.role === 'admin'
}
