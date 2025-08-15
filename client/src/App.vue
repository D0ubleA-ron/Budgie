<script setup>
import { ref, onMounted } from 'vue'
const isLoggedIn = ref(false)

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/auth/is-logged-in', {
      credentials: 'include',
    })
    const data = await res.json()
    isLoggedIn.value = data.loggedIn
  } catch (e) {
    isLoggedIn.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 text-gray-800">
    <nav class="bg-white shadow p-4 flex justify-center gap-4">
      <router-link class="text-blue-600 hover:underline" to="/">Home</router-link>
      <router-link v-if="!isLoggedIn" class="text-blue-600 hover:underline" to="/login">Login </router-link> 
      <router-link v-if="!isLoggedIn" class="text-blue-600 hover:underline" to="/register">Register </router-link>
      <router-link v-if="isLoggedIn" class="text-blue-600 hover:underline" to="/plaid">Link Bank </router-link>
      <router-link v-if="isLoggedIn" class="text-blue-600 hover:underline" to="/account">Accounts </router-link>
      <router-link v-if="isLoggedIn" class="text-blue-600 hover:underline" to="/transactions">Transactions </router-link>
      <router-link v-if="isLoggedIn" class="text-blue-600 hover:underline" to="/logout">Logout </router-link>
    </nav>

    <main class="p-6">
      <router-view />
    </main>
  </div>
</template>