<script setup>
import Card from 'primevue/card'
import Button from 'primevue/button'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { onMounted, ref, computed } from 'vue'
import { useCustomerStore } from '@/stores/customerStore.js'
import { useProjectStore } from '@/stores/projectStore.js'

const router = useRouter()
const authorized = ref(false)

// Use Pinia stores
const customerStore = useCustomerStore()
const projectStore = useProjectStore()

// Computed reactive access to customers and loading state from store
const customers = computed(() => customerStore.customers)
const loading = computed(() => customerStore.loading)
const projects = computed(() => projectStore.projects)

// Logout handler
const handleLogout = () => {
  localStorage.removeItem('jwt_token')
  localStorage.removeItem('user_role')
  router.push('/login')
}

// On component mount: check auth, then load customers if authorized
onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:4000/api/auth/admin/dashboard', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('jwt_token'),
      },
    })
    console.log('Admin dashboard response:', response.data)
    authorized.value = true

    // Always reload latest data
    await customerStore.loadCustomers()
    await projectStore.loadProjects()
  } catch (error) {
    console.error('Access denied:', error.response?.data?.message || error.message)
    alert('Access denied: ' + (error.response?.data?.message || error.message))
    router.push('/login')
  }
})
</script>

<template>
  <div
    v-if="authorized"
    class="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4"
  >
    <Card class="w-full max-w-3xl shadow-lg">
      <template #title>
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-semibold text-gray-800">Customer Management</h2>
          <div class="flex space-x-2">
            <Button
              label="Logout"
              severity="danger"
              icon="pi pi-sign-out"
              class="p-button-sm"
              @click="handleLogout"
            />
          </div>
        </div>
      </template>
      <template #content>
        <div class="flex flex-col gap-6">
          <!-- Stats + Buttons Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col bg-indigo-100 rounded-lg text-center p-4">
              <h3 class="text-lg font-semibold text-indigo-800">Total Customers</h3>
              <p class="text-2xl font-bold mb-4">{{ customers.length }}</p>
              <Button
                label="Manage Customers"
                class="w-full"
                @click="router.push('/admin/customer')"
              />
            </div>
            <div class="flex flex-col bg-purple-100 rounded-lg text-center p-4">
              <h3 class="text-lg font-semibold text-purple-800">Total Projects</h3>
              <p class="text-2xl font-bold mb-4">{{ projects.length }}</p>
              <Button
                label="Manage Projects"
                class="w-full"
                @click="router.push('/admin/project')"
              />
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
