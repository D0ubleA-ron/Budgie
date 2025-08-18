<template>
  <!-- optional: show a loading spinner or message while logging out -->
  <div v-if="loading" class="flex items-center gap-2">
    <svg class="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
    </svg>
    <span>Logging out…</span>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'

const loading = ref(false)
const router = useRouter()
const auth = useAuth()
const API = import.meta.env.VITE_API_BASE_URL || ''

let controller

const logout = async () => {
  loading.value = true
  controller = new AbortController()

  try {
    const res = await fetch(`${API}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      signal: controller.signal,
    })

    // treat 200/204 as success; also proceed on 401 (already logged out)
    if (res.ok || res.status === 204 || res.status === 401) {
      auth.markLoggedOut()               // ✅ update navbar state
      await router.replace('/login')
      return
    }

    // optional JSON error
    let message = 'Logout failed'
    try {
      const data = await res.json()
      message = data?.error || data?.message || message
    } catch {}
    throw new Error(message)

  } catch (e) {
    if (e.name !== 'AbortError') {
      console.error(e)
      alert(e.message || 'Logout failed')
    }
  } finally {
    loading.value = false
  }
}

onMounted(logout)
onBeforeUnmount(() => controller?.abort())
</script>
