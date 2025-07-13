<script setup>
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import axios from 'axios'
import { useUserStore } from '@/stores/userStore.js'

const username = ref('')
const password = ref('')
const router = useRouter()
const userStore = useUserStore()
const handleLogin = async () => {
  console.log('Login function called')
  try {
    const response = await axios.post('http://localhost:4000/api/auth/login', {
      username: username.value,
      password: password.value,
    })

    console.log('API Response:', response.data)

    const token = response.data.token
    localStorage.setItem('jwt_token', token)

    const payload = JSON.parse(atob(token.split('.')[1]))
    console.log('Decoded JWT Payload:', payload)
    localStorage.setItem('user_role', payload.role)
    userStore.setUser(payload)
    if (payload.role === 'admin') {
      router.push('/admin/dashboard')
    } else {
      router.push('/profile')
    }
  } catch (error) {
    console.error('Login failed:', error.response?.data?.message || error.message)
    alert(error.response?.data?.message || 'Login failed')
  }
}
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4"
  >
    <Card class="w-full max-w-md shadow-lg">
      <template #title>
        <div class="text-center text-2xl font-semibold text-gray-800">Sign in to your account</div>
      </template>
      <template #content>
        <form @submit.prevent="handleLogin" class="flex flex-col gap-6">
          <!-- Username Field -->
          <div class="flex flex-col gap-2">
            <label for="username" class="text-gray-700 font-medium">Username</label>
            <InputText id="username" v-model="username" class="w-full" />
          </div>

          <!-- Password Field -->
          <div class="flex flex-col gap-2">
            <label for="password" class="text-gray-700 font-medium">Password</label>
            <Password
              id="password"
              v-model="password"
              toggleMask
              class="w-full"
              inputClass="w-full"
            />
          </div>

          <!-- Login Button -->
          <Button label="Login" class="w-full" type="submit" />

          <!-- Register Link -->
          <p class="text-center text-sm text-gray-600">
            Don't have an account?
            <router-link to="/register" class="text-indigo-600 font-medium hover:underline"
              >Register here</router-link
            >
          </p>
        </form>
      </template>
    </Card>
  </div>
</template>
