import axios from 'axios'

class HTTPService {
  constructor(baseURL = '', defaultHeaders = {}) {
    this.client = axios.create({
      baseURL,
      headers: defaultHeaders,
    })

    // Request interceptor (e.g., for auth token)
    this.client.interceptors.request.use(
      (config) => {
        return config
      },
      (error) => Promise.reject(this._formatError(error)),
    )

    // Response interceptor for global error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(this._formatError(error)),
    )
  }
  get(url, config = {}) {
    return this.client.get(url, config)
  }

  post(url, data = {}, config = {}) {
    return this.client.post(url, data, config)
  }

  put(url, data = {}, config = {}) {
    return this.client.put(url, data, config)
  }

  delete(url, config = {}) {
    return this.client.delete(url, config)
  }

  // Helper: Set/Remove headers dynamically
  setHeader(key, value) {
    this.client.defaults.headers.common[key] = value
  }

  removeHeader(key) {
    delete this.client.defaults.headers.common[key]
  }

  // Private method: format errors consistently
  _formatError(error) {
    if (error.response) {
      // Server responded with a status outside the 2xx range
      return {
        message: error.response.data?.message || 'Server Error',
        status: error.response.status,
        data: error.response.data,
        type: 'response',
      }
    } else if (error.request) {
      // Request was made but no response
      return {
        message: 'No response from server',
        status: null,
        type: 'network',
      }
    } else {
      // Something went wrong in setting up the request
      return {
        message: error.message || 'Unexpected Error',
        status: null,
        type: 'client',
      }
    }
  }
}

export default HTTPService

const baseUrl = import.meta.env.MODE === 'development' ? 'http://localhost:4000' : ''
const token = localStorage.getItem('jwt_token')
export const HttpServiceInstance = new HTTPService(baseUrl, { Authorization: `Bearer ${token}` })
