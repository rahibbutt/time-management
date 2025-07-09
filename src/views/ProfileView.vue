<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import Card from 'primevue/card'
import Button from 'primevue/button'
import { useRouter } from 'vue-router'

const user = ref(null)
const router = useRouter()

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
  router.push('/login')
}

onMounted(fetchProfile)
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4"
  >
    <Card class="w-full max-w-md shadow-lg">
      <template #title>
        <div class="text-center text-2xl font-semibold text-gray-800">Your Profile</div>
      </template>
      <template #content>
        <div v-if="user" class="space-y-4 text-center">
          <p><strong>Username:</strong> {{ user.username }}</p>
          <p><strong>ID:</strong> {{ user.id }}</p>
          <Button label="Logout" class="w-full" @click="logout" />
        </div>
        <div v-else>
          <p class="text-center">Loading...</p>
        </div>
      </template>
    </Card>
  </div>
</template>
