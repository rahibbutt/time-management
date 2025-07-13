<script setup>
import Card from 'primevue/card'
import Button from 'primevue/button'
import { useRouter } from 'vue-router'

const router = useRouter()

const goToHome = () => {
  router.push('/')
}
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4"
  >
    <Card class="w-full max-w-md shadow-lg">
      <template #title>
        <div class="text-center text-2xl font-semibold text-gray-800">404 Page Not Found</div>
      </template>

      <template #content>
        <Button label="Go back to home" class="w-full" @click="goToHome" />
      </template>
    </Card>
  </div>
</template>
