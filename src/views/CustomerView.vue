<script setup>
import Card from 'primevue/card'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import 'primeicons/primeicons.css'
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useCustomerStore } from '@/stores/customerStore'

const router = useRouter()
const customerStore = useCustomerStore()
const authorized = ref(false)

const searchTerm = ref('')
const dialogVisible = ref(false)
const isEditing = ref(false)
const currentCustomer = ref({ id: null, name: '', email: '', phone: '' })

onMounted(async () => {
  try {
    await axios.get('http://localhost:4000/api/auth/admin/dashboard', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('jwt_token'),
      },
    })
    authorized.value = true
    if (customerStore.customers.length === 0) {
      await customerStore.loadCustomers()
    }
  } catch (error) {
    alert('Access denied: ' + (error.response?.data?.message || error.message))
    router.push('/login')
  }
})

const filteredCustomers = computed(() => {
  if (!searchTerm.value) return customerStore.customers

  const term = searchTerm.value.toLowerCase()
  return customerStore.customers.filter((c) => {
    return (
      c.name.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      (c.phone && c.phone.toLowerCase().includes(term))
    )
  })
})

const openNew = () => {
  isEditing.value = false
  currentCustomer.value = { id: null, name: '', email: '', phone: '' }
  dialogVisible.value = true
}

const editCustomer = (customer) => {
  isEditing.value = true
  currentCustomer.value = { ...customer }
  dialogVisible.value = true
}

const saveCustomer = async () => {
  try {
    if (isEditing.value) {
      await customerStore.updateCustomer(currentCustomer.value)
      alert('Customer updated')
    } else {
      await customerStore.addCustomer(currentCustomer.value)
      alert('Customer created')
    }
    dialogVisible.value = false
  } catch {
    alert('Failed to save customer')
  }
}

const deleteCustomer = async (customer) => {
  if (confirm(`Are you sure you want to delete ${customer.name}?`)) {
    try {
      await customerStore.deleteCustomer(customer.id)
      alert('Customer deleted')
    } catch {
      alert('Failed to delete customer')
    }
  }
}

const handleLogout = () => {
  localStorage.removeItem('jwt_token')
  localStorage.removeItem('user_role')
  router.push('/login')
}
</script>

<template>
  <div
    v-if="authorized"
    class="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4"
  >
    <Card
      class="w-full max-w-screen-sm sm:max-w-4xl md:max-w-5xl shadow-lg bg-white overflow-hidden"
    >
      <!-- Title -->
      <template #title>
        <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h2 class="text-2xl font-semibold text-gray-800">Customer Management</h2>
          <div class="flex flex-col sm:flex-row sm:flex-wrap gap-2">
            <router-link to="/admin/dashboard">
              <Button
                label="Dashboard"
                icon="pi pi-home"
                class="p-button-sm p-button-secondary w-full sm:w-auto"
              />
            </router-link>
            <Button
              label="New Customer"
              icon="pi pi-plus"
              class="p-button-sm w-full sm:w-auto"
              @click="openNew"
            />
            <Button
              label="Logout"
              severity="danger"
              icon="pi pi-sign-out"
              class="p-button-sm w-full sm:w-auto"
              @click="handleLogout"
            />
          </div>
        </div>
      </template>

      <!-- Content -->
      <template #content>
        <!-- Search bar -->
        <div class="mb-4 max-w-md w-full">
          <InputText
            v-model="searchTerm"
            placeholder="Search customers by name, email or phone"
            class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            clearable
          />
        </div>

        <!-- Responsive DataTable -->
        <div class="w-full max-w-full overflow-x-hidden">
          <DataTable
            :value="filteredCustomers"
            :loading="loading"
            :total-records="filteredCustomers.length"
            paginator
            rows="8"
            responsiveLayout="stack"
            breakpoint="640px"
            class="w-full shadow rounded"
          >
            <!-- Name Column -->
            <Column
              field="name"
              header="Name"
              sortable
              headerClass="bg-gray-100"
              class="break-words whitespace-normal max-w-[200px]"
            />

            <!-- Email Column -->
            <Column
              field="email"
              header="Email"
              sortable
              headerClass="bg-gray-100"
              class="break-words whitespace-normal max-w-[160px] sm:max-w-[220px]"
            />

            <!-- Phone Column -->
            <Column
              field="phone"
              header="Phone"
              sortable
              headerClass="bg-gray-100"
              class="break-words whitespace-normal max-w-[120px] sm:max-w-[180px]"
            />

            <!-- Actions Column -->
            <Column header="Actions" headerClass="bg-gray-100" class="text-center">
              <template #body="{ data }">
                <div
                  class="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 justify-center items-center"
                >
                  <Button
                    icon="pi pi-pencil"
                    class="p-button-sm p-button-outlined p-button-info w-full sm:w-auto"
                    @click="editCustomer(data)"
                    aria-label="Edit"
                  />
                  <Button
                    icon="pi pi-trash"
                    class="p-button-sm p-button-outlined p-button-danger w-full sm:w-auto"
                    @click="deleteCustomer(data)"
                    aria-label="Delete"
                  />
                </div>
              </template>
            </Column>
          </DataTable>
        </div>

        <!-- Customer Dialog -->
        <Dialog
          header="Customer Details"
          v-model:visible="dialogVisible"
          :modal="true"
          :closable="false"
          class="max-w-lg w-full p-6"
          content-class="bg-white rounded-lg shadow-lg"
        >
          <form @submit.prevent="saveCustomer" class="space-y-6">
            <div>
              <label for="name" class="block text-gray-700 font-semibold mb-1">Name</label>
              <InputText
                id="name"
                v-model="currentCustomer.name"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label for="email" class="block text-gray-700 font-semibold mb-1">Email</label>
              <InputText
                id="email"
                type="email"
                v-model="currentCustomer.email"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label for="phone" class="block text-gray-700 font-semibold mb-1">Phone</label>
              <InputText
                id="phone"
                v-model="currentCustomer.phone"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div class="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
              <Button
                label="Cancel"
                icon="pi pi-times"
                class="p-button-text w-full sm:w-auto"
                @click="dialogVisible = false"
                type="button"
              />
              <Button
                label="Save"
                icon="pi pi-check"
                class="p-button-primary w-full sm:w-auto"
                type="submit"
              />
            </div>
          </form>
        </Dialog>
      </template>
    </Card>
  </div>
</template>
