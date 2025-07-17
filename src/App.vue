<script setup>
import { RouterView } from 'vue-router'
import UserAuth from '@/components/UserAuth.vue'
//import HeaderComponent from '@/components/HeaderComponent.vue'
</script>

<template>
  <UserAuth>
    <RouterView />
  </UserAuth>
</template>
