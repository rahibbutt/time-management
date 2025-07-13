<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore.js'
import { HttpServiceInstance } from '@/HttpService.js'
const router = useRouter()

const userStore = useUserStore()
const fetchProfile = async () => {
  const token = localStorage.getItem('jwt_token')
  if (!token) {
    router.push('/login')
    return
  }

  try {
    const response = await HttpServiceInstance.get('/api/auth/profile')
    const user = response?.data?.user
    if (!user) {
      console.log('Backend API did not provide a user.')
      router.push('/login')
      return
    }

    userStore.setUser(user)
    if (response?.data?.user?.role === 'admin') {
      router.push('/admin/dashboard')
    } else {
      router.push('/profile')
    }
  } catch (error) {
    console.error('Failed to fetch profile:', error)
    localStorage.removeItem('jwt_token')
    router.push('/login')
  }
}
onMounted(fetchProfile)
</script>
<template>
  <slot />
</template>
