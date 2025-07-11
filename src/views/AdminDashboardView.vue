<script setup>
import Card from 'primevue/card'
import Button from 'primevue/button'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { onMounted, ref } from 'vue'

const router = useRouter()
const authorized = ref(false) // <--- NEW: Track auth state

const handleLogout = () => {
  localStorage.removeItem('jwt_token')
  localStorage.removeItem('user_role')
  router.push('/login')
}

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:4000/api/auth/admin/dashboard', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('jwt_token'),
      },
    })
    console.log('Admin dashboard response:', response.data)
    authorized.value = true // <--- Allow rendering
  } catch (error) {
    console.error('Access denied:', error.response?.data?.message || error.message)
    alert('Access denied: ' + (error.response?.data?.message || error.message))
    router.push('/login') // Redirect if unauthorized
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
        <div class="text-center text-2xl font-semibold text-gray-800">Admin Dashboard</div>
      </template>
      <template #content>
        <div class="flex flex-col gap-6">
          <!-- Example Stats or Actions -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 bg-indigo-100 rounded-lg text-center">
              <h3 class="text-lg font-semibold text-indigo-800">Users</h3>
              <p class="text-2xl font-bold">124</p>
            </div>
            <div class="p-4 bg-purple-100 rounded-lg text-center">
              <h3 class="text-lg font-semibold text-purple-800">New Signups</h3>
              <p class="text-2xl font-bold">8</p>
            </div>
          </div>

          <!-- Example Action Buttons -->
          <div class="flex flex-col gap-2">
            <Button label="Manage Users" class="w-full" />
            <Button label="View Reports" severity="secondary" class="w-full" />
            <Button label="Logout" severity="danger" class="w-full" @click="handleLogout" />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
