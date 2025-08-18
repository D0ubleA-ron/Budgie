<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const isLoggedIn = ref(false)
const hasBank = ref(false)
const menuOpen = ref(false)
const route = useRoute()
const API = import.meta.env.VITE_API_BASE_URL


async function checkAuth() {
  try {
    const res = await fetch(`${API}/api/auth/is-logged-in`, { credentials: 'include' })
    const data = await res.json().catch(() => ({}))
    isLoggedIn.value = !!data?.loggedIn
  } catch {
    isLoggedIn.value = false
  }
}

async function checkBankLinked() {
  if (!isLoggedIn.value) {
    hasBank.value = false
    return
  }
  try {
    const res = await fetch(`${API}/api/plaid/accounts`, { credentials: 'include' })
    if (res.ok) { hasBank.value = true; return }
    const data = await res.json().catch(() => ({}))
    hasBank.value = !(data?.error === 'No access token linked to user')
  } catch {
    hasBank.value = false
  }
}

onMounted(async () => {
  await checkAuth()
  await checkBankLinked()
})

function linkBase(active) {
  return [
    'px-3 py-2 rounded-lg text-sm font-medium transition',
    active
      ? 'text-gray-900 bg-gray-100'
      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
  ].join(' ')
}
function linkClass(to) {
  const active = route.path === to
  return linkBase(active)
}

// Only show the links the user needs
const visibleLinks = computed(() => {
  if (!isLoggedIn.value) {
    return [
      { to: '/', label: 'Home' },
      { to: '/login', label: 'Login' },
      { to: '/register', label: 'Register' },
    ]
  }
  if (!hasBank.value) {
    return [
      { to: '/', label: 'Home' },
      { to: '/plaid', label: 'Link Bank' },
      { to: '/logout', label: 'Logout' },
    ]
  }
  return [
    { to: '/', label: 'Home' },
    { to: '/account', label: 'Accounts' },
    { to: '/transactions', label: 'Transactions' },
    { to: '/logout', label: 'Logout' },
  ]
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-800">
    <header class="sticky top-0 z-50">
      <nav class="bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4">
          <div class="flex items-center justify-between h-16">
            <!-- Brand -->
            <RouterLink to="/" class="flex items-center gap-2">
              <div class="h-9 w-9 rounded-xl grid place-items-center bg-teal-100 text-teal-700 text-lg">🐦</div>
              <span class="text-lg font-extrabold tracking-tight">Budgie</span>
            </RouterLink>

            <!-- Desktop links -->
            <div class="hidden md:flex items-center gap-1">
              <RouterLink
                v-for="link in visibleLinks"
                :key="link.to"
                :to="link.to"
                :class="linkClass(link.to)"
              >
                {{ link.label }}
              </RouterLink>
            </div>

            <!-- Mobile menu button -->
            <button
              class="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              @click="menuOpen = !menuOpen"
              :aria-expanded="menuOpen"
              aria-label="Toggle menu"
            >
              <svg v-if="!menuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                   d="M4 6h16M4 12h16M4 18h16"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                   d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        <!-- Mobile menu -->
        <div v-show="menuOpen" class="md:hidden border-t border-gray-200">
          <div class="px-4 py-3 flex flex-col gap-1 bg-white">
            <RouterLink
              v-for="link in visibleLinks"
              :key="link.to"
              :to="link.to"
              :class="linkClass(link.to)"
              @click="menuOpen = false"
            >
              {{ link.label }}
            </RouterLink>
          </div>
        </div>

        <div class="h-[2px] bg-gradient-to-r from-teal-400 via-emerald-500 to-cyan-400"></div>
      </nav>
    </header>

    <main class="p-6 max-w-7xl mx-auto">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
/* Tailwind only */
</style>
