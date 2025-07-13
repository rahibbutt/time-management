<script setup>
import { useUserStore } from '@/stores/userStore.js'

const store = useUserStore()
console.log('store', store)
</script>

<template>
  <div
    class="w-full min-h-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 flex px-4 justify-end items-center"
  >
    <div>{{ store?.user ? `Logged in as ${store?.user?.username}` : 'Not logged In' }}</div>
  </div>
</template>
