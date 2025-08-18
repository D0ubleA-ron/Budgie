<template>
  <div class="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-teal-50 to-white flex items-center justify-center px-4 py-10">
    <div class="w-full max-w-md">
      <div class="rounded-2xl bg-white/80 backdrop-blur border border-gray-200 shadow-lg p-6 md:p-8">
        <div class="mb-6 text-center">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-sm font-medium">
            <span>🔐</span> Secure Login
          </div>
          <h2 class="mt-3 text-2xl font-bold text-gray-900">Welcome back</h2>
          <p class="mt-1 text-gray-600 text-sm">Sign in to access your Budgie dashboard.</p>
        </div>

        <form @submit.prevent="handleLogin" novalidate>
          <!-- Error banner -->
          <div
            v-if="error"
            class="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm"
            role="alert"
          >
            {{ error }}
          </div>

          <!-- Email -->
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              v-model.trim="email"
              type="email"
              required
              autocomplete="email"
              placeholder="you@example.com"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <!-- Password -->
          <div class="mb-2">
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div class="relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                required
                autocomplete="current-password"
                placeholder="••••••••"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 pr-11 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
              >
                <span v-if="showPassword">🙈</span>
                <span v-else>👁️</span>
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between mb-6">
            <label class="inline-flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" v-model="remember" class="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
              Remember me
            </label>
            <RouterLink to="/register" class="text-sm font-medium text-teal-700 hover:text-teal-800">
              Create account
            </RouterLink>
          </div>

          <button
            type="submit"
            :disabled="loading || !email || !password"
            class="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 text-white font-semibold px-4 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition"
          >
            <svg
              v-if="loading"
              class="h-5 w-5 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <span>{{ loading ? 'Signing in…' : 'Login' }}</span>
          </button>
        </form>

        <p class="mt-6 text-center text-xs text-gray-500">
          By continuing you agree to our terms and privacy policy.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'  

const router = useRouter()
const auth = useAuth()                    

const email = ref('')
const password = ref('')
const remember = ref(false)
const showPassword = ref(false)
const error = ref('')
const loading = ref(false)
const API = import.meta.env.VITE_API_BASE_URL

const handleLogin = async () => {
  if (!email.value || !password.value) return
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
        remember: remember.value
      })
    })
    const data = await res.json().catch(() => null)
    if (!res.ok) throw new Error(data?.error || data?.message || 'Login failed')
    await auth.refresh()                  

    router.replace('/transactions')
  } catch (e) {
    error.value = e?.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* All styling via Tailwind */
</style>
