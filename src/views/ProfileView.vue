<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import Card from 'primevue/card'
import Button from 'primevue/button'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore.js'

const user = ref(null)
const router = useRouter()
const userStore = useUserStore()
const fetchProfile = async () => {
  const token = localStorage.getItem('jwt_token')
  if (!token) {
    router.push('/login')
    return
  }

  try {
    const response = await axios.get('http://localhost:4000/api/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    user.value = response.data.user
  } catch (error) {
    console.error('Failed to fetch profile:', error)
    localStorage.removeItem('jwt_token')
    router.push('/login')
  }
}

const logout = () => {
  localStorage.removeItem('jwt_token')
  userStore.setUser(null)
  router.push('/login')
}

const goToRecordTime = () => {
  router.push('/profile/time')
}

onMounted(fetchProfile)
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6"
  >
    <Card class="w-full max-w-lg shadow-xl rounded-2xl">
      <template #title>
        <div class="relative">
          <!-- Top-right Logout inside Card -->
          <div class="absolute top-0 right-0">
            <Button
              label="Logout"
              severity="danger"
              icon="pi pi-sign-out"
              class="p-button-sm w-full sm:w-auto"
              @click="logout"
            />
          </div>

          <!-- Avatar and Greeting -->
          <div class="flex flex-col items-center space-y-4 pt-8">
            <div
              class="w-24 h-24 rounded-full bg-gradient-to-r from-pink-400 to-indigo-400 flex items-center justify-center text-white text-4xl font-bold shadow-md"
            >
              {{ user?.username?.charAt(0).toUpperCase() || '?' }}
            </div>
            <h2 class="text-2xl font-semibold text-gray-800">
              Hello, {{ user?.username || 'User' }}
            </h2>
          </div>
        </div>
      </template>

      <template #content>
        <div v-if="user" class="space-y-4">
          <!-- User Details -->
          <div class="space-y-3">
            <div class="bg-gray-100 rounded-lg p-4 shadow-sm">
              <p class="text-gray-700"><strong>User ID:</strong> {{ user.id }}</p>
            </div>
            <div class="bg-gray-100 rounded-lg p-4 shadow-sm">
              <p class="text-gray-700">
                <strong>Email:</strong> {{ user.email || 'Not provided' }}
              </p>
            </div>
            <div class="bg-gray-100 rounded-lg p-4 shadow-sm">
              <p class="text-gray-700">
                <strong>Account Type:</strong> {{ user.role || 'Standard User' }}
              </p>
            </div>
            <div class="bg-gray-100 rounded-lg p-4 shadow-sm">
              <p class="text-gray-700">
                <strong>Joined:</strong>
                {{ user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown' }}
              </p>
            </div>
          </div>

          <Button
            v-if="user.role !== 'admin'"
            label="Go to Record Time"
            class="w-full bg-indigo-600 border-none hover:bg-indigo-700"
            @click="goToRecordTime"
          />
        </div>
        <div v-else class="text-center text-gray-700">Loading profile...</div>
      </template>
    </Card>
  </div>
</template>
