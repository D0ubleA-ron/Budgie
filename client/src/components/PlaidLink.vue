<template>
  <div class="max-w-3xl mx-auto px-4 py-8">
    <!-- Status / errors -->
    <div v-if="error" class="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
      {{ error }}
      <button class="ml-2 text-teal-700 underline" @click="retry">Try again</button>
    </div>

    <div v-else-if="linking" class="mb-4 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm flex items-center gap-2">
      <svg class="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
      </svg>
      Opening secure Plaid Link…
    </div>

    <!-- Accounts -->
    <section v-if="accounts.length" class="space-y-4">
      <h3 class="text-xl font-semibold text-gray-900">Linked Accounts</h3>
      <ul class="grid gap-4 md:grid-cols-2">
        <li
          v-for="acc in accounts"
          :key="acc.account_id"
          class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="text-lg font-semibold text-gray-900">
                {{ acc.name || acc.official_name || 'Account' }}
                <span v-if="acc.mask" class="text-gray-500 font-normal"> •••• {{ acc.mask }}</span>
              </div>
              <div class="mt-1 text-sm text-gray-600">
                {{ acc.type || '—' }} <span v-if="acc.subtype">• {{ acc.subtype }}</span>
              </div>
            </div>
          </div>
          <div class="mt-4 grid grid-cols-2 gap-3">
            <div class="rounded-xl border border-gray-100 bg-gray-50 p-3">
              <div class="text-xs text-gray-500">Current</div>
              <div class="text-base font-semibold text-gray-900">
                {{ fmtMoney(acc.balances?.current, acc.balances?.iso_currency_code || acc.balances?.unofficial_currency_code) }}
              </div>
            </div>
            <div class="rounded-xl border border-gray-100 bg-gray-50 p-3">
              <div class="text-xs text-gray-500">Available</div>
              <div class="text-base font-semibold text-gray-900">
                {{ fmtMoney(acc.balances?.available, acc.balances?.iso_currency_code || acc.balances?.unofficial_currency_code) }}
              </div>
            </div>
          </div>
        </li>
      </ul>
    </section>

    <!-- If nothing and not linking, we’ll prompt to try again -->
    <p v-else-if="!linking && !error" class="text-sm text-gray-600">
      No accounts yet. Attempting to open Plaid Link…
    </p>
  </div>
</template>

<script>
const API = import.meta.env.VITE_API_BASE_URL
export default {
  
  data() {
    return {
      linkToken: null,
      plaidHandler: null,
      linking: false,
      accounts: [],
      error: ''
    }
  },
  async mounted() {
    // 1) If already linked, just show accounts
    const linked = await this.tryLoadAccounts()
    if (linked) return

    // 2) Otherwise, run Plaid flow automatically
    this.preparePlaid().catch(err => {
      this.error = err?.message || 'Failed to start Plaid Link.'
      this.linking = false
    })
  },
  methods: {
    async tryLoadAccounts() {
      try {
        const res = await fetch(`${API}/api/plaid/accounts`, {
          credentials: 'include'
        })
        const data = await res.json().catch(() => null)
        if (!res.ok) {
          // If the user isn’t linked yet, backend likely returns a known error
          return false
        }
        this.accounts = Array.isArray(data) ? data : []
        return true
      } catch {
        return false
      }
    },
    async loadPlaidScript() {
      if (window.Plaid) return
      await new Promise((resolve, reject) => {
        const s = document.createElement('script')
        s.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js'
        s.async = true
        s.onload = resolve
        s.onerror = () => reject(new Error('Failed to load Plaid Link script'))
        document.head.appendChild(s)
      })
    },
    async preparePlaid() {
      this.error = ''
      this.linking = true

      await this.loadPlaidScript()

      // Create link token
      const resp = await fetch(`${API}/api/plaid/create-link-token`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await resp.json().catch(() => null)
      if (!resp.ok) throw new Error(data?.error || 'Failed to fetch link token')
      this.linkToken = data.link_token

      // Init Plaid Link
      this.plaidHandler = window.Plaid.create({
        token: this.linkToken,
        onSuccess: async (public_token) => {
          try {
            const exchangeRes = await fetch(`${API}/api/plaid/exchange-public-token`, {
              method: 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ public_token }),
            })
            if (!exchangeRes.ok) throw new Error('Failed to exchange token')

            // After successful exchange, load accounts
            await this.tryLoadAccounts()
          } catch (e) {
            this.error = e?.message || 'Token exchange failed.'
          } finally {
            this.linking = false
          }
        },
        onExit: (err) => {
          this.linking = false
          if (err) this.error = err.display_message || 'Plaid Link exited.'
        },
      })

      // Open it automatically
      this.plaidHandler.open()
    },
    retry() {
      this.error = ''
      this.preparePlaid().catch(err => {
        this.error = err?.message || 'Failed to start Plaid Link.'
        this.linking = false
      })
    },
    fmtMoney(amount, currency) {
      if (amount == null) return '—'
      try {
        return new Intl.NumberFormat(undefined, { style: 'currency', currency: currency || 'USD' }).format(amount)
      } catch {
        return `${Number(amount).toFixed(2)}${currency ? ' ' + currency : ''}`
      }
    }
  }
}
</script>

<style scoped>
/* Tailwind handles styling */
</style>
