<script setup>
import { ref } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Password from 'primevue/password';

const username = ref('');
const password = ref('');

const handleLogin = () => {
  console.log('Logging in with:', username.value, password.value);
  // You can add router or API logic here
};
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <Card class="w-96 shadow-lg">
      <template #title>
        Login
      </template>
      <template #content>
        <div class="flex flex-col gap-4">
          <span class="p-float-label">
            <InputText id="username" v-model="username" />
            <label for="username">Username</label>
          </span>
          <span class="p-float-label">
            <Password id="password" v-model="password" toggleMask />
            <label for="password">Password</label>
          </span>
          <Button label="Login" @click="handleLogin" class="w-full" />
        </div>
      </template>
    </Card>
  </div>
</template>

<style scoped>
/* Optional: Add some extra styling if needed */
</style>
