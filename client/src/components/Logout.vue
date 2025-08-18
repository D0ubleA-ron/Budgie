<template>
  <button
    @click="logout"
    :disabled="loading"
    class="inline-flex items-center gap-2 rounded-xl bg-gray-900 text-white font-semibold px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition"
  >
    <svg v-if="loading" class="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
    </svg>
    <span>{{ loading ? 'Logging out…' : 'Logout' }}</span>
  </button>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const loading = ref(false)
const router = useRouter()
const API = import.meta.env.VITE_API_BASE_URL

const logout = async () => {
  loading.value = true
  try {
    const res = await fetch(`${API}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })

    // Try to read JSON if present; tolerate 204/empty responses
    let message = 'Logout failed'
    if (!res.ok) {
      try {
        const data = await res.json()
        message = data?.error || data?.message || message
      } catch {}
      throw new Error(message)
    }

    // Redirect to login (use route name if you prefer)
    await router.replace('/login')

    // Optional: force a full refresh to immediately update navbar auth state
    // location.reload()

  } catch (e) {
    console.error(e)
    alert(e.message || 'Logout failed')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Tailwind handles styling */
</style>
