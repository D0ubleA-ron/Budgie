import { defineStore } from 'pinia'

const API = import.meta.env.VITE_API_BASE_URL || ''

export const useAuth = defineStore('auth', {
  state: () => ({
    loggedIn: false,
    hasBank: false,
    initialized: false,
  }),
  actions: {
    async refresh() {
      try {
        const res = await fetch(`${API}/api/auth/is-logged-in`, { credentials: 'include' })
        const data = await res.json().catch(() => ({}))
        this.loggedIn = !!data?.loggedIn
      } catch {
        this.loggedIn = false
      }

      if (!this.loggedIn) {
        this.hasBank = false
        this.initialized = true
        return
      }

      try {
        const res = await fetch(`${API}/api/plaid/accounts`, { credentials: 'include' })
        if (res.ok) {
          this.hasBank = true
        } else {
          const data = await res.json().catch(() => ({}))
          this.hasBank = !(data?.error === 'No access token linked to user')
        }
      } catch {
        this.hasBank = false
      } finally {
        this.initialized = true
      }
    },
    markLoggedOut() {
      this.loggedIn = false
      this.hasBank = false
      this.initialized = true
    },
  },
})
