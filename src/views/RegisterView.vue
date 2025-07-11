<script setup>
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Card from 'primevue/card'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match')
    return
  }
  try {
    const response = await axios.post('http://localhost:4000/api/auth/register', {
      username: username.value,
      email: email.value,
      password: password.value,
    })

    alert('Registration successful! Token: ' + response.data.token)
    router.push('/')
  } catch (error) {
    if (error.response) {
      alert('Error: ' + error.response.data.message)
    } else {
      alert('Network error')
    }
  }
}
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4"
  >
    <Card class="w-full max-w-md shadow-lg">
      <template #title>
        <div class="text-center text-2xl font-semibold text-gray-800">Create a New Account</div>
      </template>
      <template #content>
        <form @submit.prevent="handleRegister" class="flex flex-col gap-6">
          <!-- Username -->
          <div class="flex flex-col gap-2">
            <label for="username" class="text-gray-700 font-medium">Username</label>
            <InputText id="username" v-model="username" class="w-full" />
          </div>

          <!-- Email -->
          <div class="flex flex-col gap-2">
            <label for="email" class="text-gray-700 font-medium">Email</label>
            <InputText id="email" v-model="email" type="email" class="w-full" />
          </div>

          <!-- Password -->
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

          <!-- Confirm Password -->
          <div class="flex flex-col gap-2">
            <label for="confirmPassword" class="text-gray-700 font-medium">Confirm Password</label>
            <Password
              id="confirmPassword"
              v-model="confirmPassword"
              toggleMask
              class="w-full"
              inputClass="w-full"
            />
          </div>

          <!-- Register Button -->
          <Button label="Register" class="w-full" type="submit" />

          <!-- Link to Login -->
          <p class="text-center text-sm text-gray-600">
            Already have an account?

            <router-link to="/login" class="text-indigo-600 font-medium hover:underline"
              >Sign in</router-link
            >
          </p>
        </form>
      </template>
    </Card>
  </div>
</template>
