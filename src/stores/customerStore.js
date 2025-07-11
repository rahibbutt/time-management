import { defineStore } from 'pinia'
import axios from 'axios'

export const useCustomerStore = defineStore('customer', {
  state: () => ({
    customers: [],
    loading: false,
  }),
  actions: {
    async loadCustomers() {
      this.loading = true
      try {
        const token = localStorage.getItem('jwt_token')
        const response = await axios.get('http://localhost:4000/api/admin/customer', {
          headers: { Authorization: `Bearer ${token}` },
        })
        this.customers = response.data
      } catch (error) {
        console.error('Failed to load customers:', error)
      } finally {
        this.loading = false
      }
    },

    async addCustomer(customer) {
      try {
        const token = localStorage.getItem('jwt_token')
        const response = await axios.post('http://localhost:4000/api/admin/customer', customer, {
          headers: { Authorization: `Bearer ${token}` },
        })
        this.customers.push(response.data)
      } catch (error) {
        console.error('Failed to add customer:', error)
      }
    },

    async updateCustomer(customer) {
      try {
        const token = localStorage.getItem('jwt_token')
        await axios.put(`http://localhost:4000/api/admin/customer/${customer.id}`, customer, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const index = this.customers.findIndex((c) => c.id === customer.id)
        if (index !== -1) this.customers[index] = customer
      } catch (error) {
        console.error('Failed to update customer:', error)
      }
    },

    async deleteCustomer(id) {
      try {
        const token = localStorage.getItem('jwt_token')
        await axios.delete(`http://localhost:4000/api/admin/customer/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        this.customers = this.customers.filter((c) => c.id !== id)
      } catch (error) {
        console.error('Failed to delete customer:', error)
      }
    },
  },
})
