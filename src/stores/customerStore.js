import { defineStore } from 'pinia'
import { CustomerService } from '@/services/customerService'

export const useCustomerStore = defineStore('customer', {
  state: () => ({
    customers: [],
    loading: false,
  }),

  actions: {
    async loadCustomers() {
      this.loading = true
      try {
        const res = await CustomerService.fetchAll()
        this.customers = res.data
      } catch (error) {
        console.error('Failed to load customers:', error)
      } finally {
        this.loading = false
      }
    },

    addCustomer(customer) {
      this.customers.push(customer)
    },

    updateCustomer(customer) {
      const index = this.customers.findIndex((c) => c.id === customer.id)
      if (index !== -1) {
        this.customers.splice(index, 1, customer)
      }
    },

    deleteCustomer(id) {
      this.customers = this.customers.filter((c) => c.id !== id)
    },
  },
})
