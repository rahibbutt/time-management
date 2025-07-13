import { HttpServiceInstance } from '@/HttpService.js'

export async function checkAuthorization() {
  try {
    await HttpServiceInstance.get(`/api/auth/admin/dashboard`)
    return true
  } catch (err) {
    console.error('Authorization failed:', err)
    throw err
  }
}
