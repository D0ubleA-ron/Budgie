<template>
  <div class="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-teal-50 to-white flex items-center justify-center px-4 py-10">
    <div class="w-full max-w-md">
      <div class="rounded-2xl bg-white/80 backdrop-blur border border-gray-200 shadow-lg p-6 md:p-8">
        <div class="mb-6 text-center">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-sm font-medium">
            <span>📝</span> Create an account
          </div>
          <h2 class="mt-3 text-2xl font-bold text-gray-900">Join Budgie</h2>
          <p class="mt-1 text-gray-600 text-sm">Sign up to start tracking your finances.</p>
        </div>

        <!-- Error banner -->
        <div
          v-if="errorMessage"
          class="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm"
          role="alert"
        >
          {{ errorMessage }}
        </div>

        <!-- Success banner -->
        <div
          v-if="success"
          class="mb-4 rounded-lg border border-green-200 bg-green-50 text-green-700 px-3 py-2 text-sm"
          role="status"
        >
          Account created successfully! You can now log in.
        </div>

        <form @submit.prevent="register" novalidate>
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
          <div class="mb-4">
            <div class="flex items-center justify-between">
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <span class="text-xs text-gray-500">8+ characters</span>
            </div>
            <div class="relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                required
                minlength="8"
                autocomplete="new-password"
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

          <!-- Confirm Password -->
          <div class="mb-6">
            <label for="confirm" class="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
            <div class="relative">
              <input
                :type="showConfirm ? 'text' : 'password'"
                id="confirm"
                v-model="confirm"
                required
                placeholder="••••••••"
                class="w-full rounded-lg border border-gray-300 px-3 py-2 pr-11 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <button
                type="button"
                @click="showConfirm = !showConfirm"
                class="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                :aria-label="showConfirm ? 'Hide password' : 'Show password'"
              >
                <span v-if="showConfirm">🙈</span>
                <span v-else>👁️</span>
              </button>
            </div>
            <p v-if="confirm && !passwordsMatch" class="mt-1 text-xs text-red-600">Passwords don’t match.</p>
          </div>

          <button
            type="submit"
            :disabled="loading || !canSubmit"
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
            <span>{{ loading ? 'Creating account…' : 'Register' }}</span>
          </button>
        </form>

        <p class="mt-6 text-center text-sm text-gray-600">
          Already have an account?
          <RouterLink to="/login" class="font-medium text-teal-700 hover:text-teal-800">Log in</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
// If you want to auto-redirect after success, uncomment the next two lines:
// import { useRouter } from 'vue-router'
// const router = useRouter()

const email = ref('')
const password = ref('')
const confirm = ref('')
const showPassword = ref(false)
const showConfirm = ref(false)
const errorMessage = ref('')
const success = ref(false)
const loading = ref(false)

const passwordsMatch = computed(() => password.value && confirm.value && password.value === confirm.value)
const canSubmit = computed(() =>
  !!email.value && !!password.value && !!confirm.value && password.value.length >= 8 && passwordsMatch.value
)

async function register() {
  errorMessage.value = ''
  success.value = false
  if (!canSubmit.value) {
    errorMessage.value = 'Please fill in all fields correctly.'
    return
  }

  loading.value = true
  try {
    const res = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // If your server sets a cookie on register, you can include credentials:
      // credentials: 'include',
      body: JSON.stringify({ email: email.value, password: password.value })
    })

    const data = await res.json().catch(() => null)
    if (!res.ok) throw new Error(data?.error || data?.message || 'Something went wrong.')

    success.value = true
    email.value = ''
    password.value = ''
    confirm.value = ''

    // Optional: redirect to login after a short delay
    // setTimeout(() => router.push('/login'), 600)
  } catch (e) {
    errorMessage.value = e?.message || 'Failed to connect to server.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Tailwind handles styling */
</style>
