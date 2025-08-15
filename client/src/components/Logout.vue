<template>
  <button @click="logout" :disabled="loading">
    <span v-if="loading">Logging out...</span>
    <span v-else>Logout</span>
  </button>
</template>

<script setup>
import { ref } from 'vue'
const loading = ref(false)

const logout = async () => {
  loading.value = true
  try {
    const res = await fetch('http://localhost:3000/api/auth/logout', {
      method: 'POST',
      credentials: 'include', // send cookie
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || 'Logout failed')
    }

    
  } catch (e) {
    console.error(e)
    alert(e.message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
button { padding: 8px 12px; }
</style>
