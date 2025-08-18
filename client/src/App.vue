<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/stores/auth'

const route = useRoute()
const auth = useAuth()

onMounted(() => { auth.refresh() })
// Re-check on every navigation so the links update immediately
watch(() => route.fullPath, () => { auth.refresh() })

function linkBase(active) {
  return [
    'px-3 py-2 rounded-lg text-sm font-medium transition',
    active ? 'text-gray-900 bg-gray-100' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
  ].join(' ')
}
function linkClass(to) {
  const active = route.path === to
  return linkBase(active)
}

const visibleLinks = computed(() => {
  if (!auth.loggedIn) {
    return [
      { to: '/', label: 'Home' },
      { to: '/login', label: 'Login' },
      { to: '/register', label: 'Register' },
    ]
  }
  if (!auth.hasBank) {
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
