import axios from 'axios'

class HTTPService {
  constructor(baseURL = '') {
    this.client = axios.create({ baseURL })

    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('jwt_token')
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(this._formatError(error)),
    )

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 403 || error.response?.status === 401) {
          localStorage.removeItem('jwt_token')
          window.location.href = '/login'
        }
        return Promise.reject(this._formatError(error))
      },
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

  setHeader(key, value) {
    this.client.defaults.headers.common[key] = value
  }

  removeHeader(key) {
    delete this.client.defaults.headers.common[key]
  }

  _formatError(error) {
    if (error.response) {
      return {
        message: error.response.data?.message || 'Server Error',
        status: error.response.status,
        data: error.response.data,
        type: 'response',
      }
    } else if (error.request) {
      return {
        message: 'No response from server',
        status: null,
        type: 'network',
      }
    } else {
      return {
        message: error.message || 'Unexpected Error',
        status: null,
        type: 'client',
      }
    }
  }
}

const baseUrl = import.meta.env.MODE === 'development' ? 'http://localhost:4000' : ''

export const HttpServiceInstance = new HTTPService(baseUrl)

export default HTTPService
