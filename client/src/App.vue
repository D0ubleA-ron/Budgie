<template>
  <div class="min-h-screen bg-gray-100 text-gray-800">
    <nav class="bg-white shadow p-4 flex justify-center gap-4">
      <router-link class="text-blue-600 hover:underline" to="/">Home</router-link>
      <router-link class="text-blue-600 hover:underline" to="/login">Login</router-link>
      <router-link class="text-blue-600 hover:underline" to="/register">Register</router-link>
      <router-link class="text-blue-600 hover:underline" to="/plaid">Link Bank</router-link>
      <router-link class="text-blue-600 hover:underline" to="/account">Accounts</router-link>
      <router-link class="text-blue-600 hover:underline" to="/logout">Logout</router-link>
    </nav>

    <main class="p-6">
      <router-view />
    </main>
  </div>
</template>

<script setup>
// No JS logic here yet
</script>
