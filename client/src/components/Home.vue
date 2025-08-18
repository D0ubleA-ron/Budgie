<template>
  <div class="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-teal-50 to-white">
    <!-- Hero -->
    <section class="max-w-6xl mx-auto px-4 py-16 text-center">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-sm font-medium mb-4">
        <span class="text-lg">💸</span> Budgie · Personal Finance
      </div>

      <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
        Welcome to <span class="text-teal-500">Budgie</span>
      </h1>
      <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
        Track spending, see transactions, and stay on top of your accounts — all in one place.
      </p>

      <!-- Quick actions -->
      <div class="mt-8 flex flex-wrap justify-center gap-3">
        <!-- Guest actions -->
        <template v-if="!isLoggedIn">
          <RouterLink
            to="/register"
            class="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-600 text-white font-semibold shadow-sm hover:bg-teal-700 transition"
          >
            <span>Get started</span> <span aria-hidden>→</span>
          </RouterLink>
          <RouterLink
            to="/login"
            class="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-gray-900 font-semibold shadow-sm ring-1 ring-gray-200 hover:bg-gray-50 transition"
          >
            Log in
          </RouterLink>
        </template>

        <!-- Logged-in actions -->
        <template v-else>
          <!-- While checking, show a lightweight skeleton to avoid flicker -->
          <template v-if="!ctaReady">
            <div class="h-[44px] w-40 rounded-xl bg-white/60 ring-1 ring-gray-200 animate-pulse"></div>
          </template>
          <template v-else>
            <RouterLink
              v-if="hasBank"
              to="/account"
              class="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-gray-900 font-semibold shadow-sm ring-1 ring-gray-200 hover:bg-gray-50 transition"
            >
              View account
            </RouterLink>
            <RouterLink
              v-else
              to="/plaid"
              class="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-gray-900 font-semibold shadow-sm ring-1 ring-gray-200 hover:bg-gray-50 transition"
            >
              Link a bank
            </RouterLink>

            <RouterLink
              to="/transactions"
              class="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-gray-900 font-semibold shadow-sm ring-1 ring-gray-200 hover:bg-gray-50 transition"
            >
              View transactions
            </RouterLink>
          </template>
        </template>
      </div>
    </section>

    <!-- Glass card -->
    <section class="max-w-5xl mx-auto px-4 -mt-4 pb-16">
      <div class="rounded-2xl bg-white/70 backdrop-blur shadow-lg ring-1 ring-gray-200">
        <div class="p-6 md:p-8">
          <div class="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
            <div class="shrink-0 h-12 w-12 rounded-xl bg-teal-100 text-teal-700 grid place-items-center text-2xl">🏠</div>
            <div class="flex-1">
              <h2 class="text-xl md:text-2xl font-bold text-gray-900">Your finance home base</h2>
              <p class="mt-1 text-gray-600">
                Connect your bank once, then explore clean, searchable transactions and simple account insights.
              </p>
            </div>

            <!-- Contextual CTA in the card -->
            <template v-if="isLoggedIn">
              <template v-if="!ctaReady">
                <div class="h-[40px] w-36 rounded-lg bg-white/60 ring-1 ring-gray-200 animate-pulse"></div>
              </template>
              <RouterLink
                v-else-if="hasBank"
                to="/account"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white font-semibold shadow-sm hover:bg-gray-800 transition"
              >
                Account info <span aria-hidden>↗</span>
              </RouterLink>
              <RouterLink
                v-else
                to="/plaid"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-gray-900 font-semibold shadow-sm ring-1 ring-gray-200 hover:bg-gray-50 transition"
              >
                Link a bank
              </RouterLink>
            </template>

            <RouterLink
              v-else
              to="/register"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 text-white font-semibold shadow-sm hover:bg-teal-700 transition"
            >
              Get started <span aria-hidden>→</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Feature grid (unchanged) -->
    <section class="max-w-6xl mx-auto px-4 pb-24">
      <!-- ... your feature cards ... -->
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isLoggedIn = ref(false)
const hasBank = ref(false)
const ctaReady = ref(false) // <-- gate rendering of CTAs
const API = import.meta.env.VITE_API_BASE_URL


onMounted(async () => {
  try {
    const res = await fetch(`${API}/api/auth/is-logged-in`, { credentials: 'include' })
    const data = await res.json()
    isLoggedIn.value = !!data?.loggedIn
  } catch {
    isLoggedIn.value = false
  }

  if (isLoggedIn.value) {
    try {
      const res = await fetch(`${API}/api/plaid/accounts`, { credentials: 'include' })
      hasBank.value = res.ok
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        hasBank.value = !(d?.error === 'No access token linked to user')
      }
    } catch {
      hasBank.value = false
    }
  }

  ctaReady.value = true // reveal CTAs only after checks finish
})
</script>

<style scoped>
/* Tailwind handles styling */
</style>
