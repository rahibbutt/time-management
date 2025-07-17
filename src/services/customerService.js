import { HttpServiceInstance } from '@/utils/HttpService.js'

export const CustomerService = {
  async fetchAll() {
    return await HttpServiceInstance.get('/api/admin/customer')
  },

  async create(customer) {
    return await HttpServiceInstance.post('/api/admin/customer', customer)
  },

  async update(customer) {
    return await HttpServiceInstance.put(`/api/admin/customer/${customer.id}`, customer)
  },

  async deleteCustomer(id) {
    return await HttpServiceInstance.delete(`/api/admin/customer/${id}`)
  },
}
