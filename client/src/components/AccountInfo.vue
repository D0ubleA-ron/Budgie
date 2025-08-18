<template>
  <div class="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-teal-50 to-white">
    <section class="max-w-6xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Linked Accounts</h1>
          <p class="text-sm text-gray-600">Balances and basic details from your bank connection.</p>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="fetchAccounts"
            :disabled="loading"
            class="inline-flex items-center gap-2 rounded-xl bg-gray-900 text-white font-semibold px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition"
          >
            <svg v-if="loading" class="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
            </svg>
            <span>{{ loading ? 'Refreshing…' : 'Refresh' }}</span>
          </button>
        </div>
      </div>

      <!-- Error -->
      <div
        v-if="error"
        class="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm"
        role="alert"
      >
        {{ error }}
        <RouterLink v-if="error.includes('No access token linked to user')" to="/plaid" class="ml-1 underline">
          Link a bank
        </RouterLink>
      </div>

      <!-- Skeletons -->
      <div v-if="loading && !accounts.length" class="grid gap-4 md:grid-cols-2">
        <div v-for="i in 4" :key="i" class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div class="animate-pulse space-y-3">
            <div class="h-5 w-48 bg-gray-200 rounded"></div>
            <div class="h-4 w-24 bg-gray-200 rounded"></div>
            <div class="h-12 w-full bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Accounts -->
      <div v-else-if="accounts.length" class="grid gap-4 md:grid-cols-2">
        <article
          v-for="acc in accounts"
          :key="acc.account_id"
          class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow transition"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <h2 class="text-lg font-semibold text-gray-900">
                {{ acc.name || acc.official_name || 'Account' }}
                <span v-if="acc.mask" class="text-gray-500 font-normal">•••• {{ acc.mask }}</span>
              </h2>
              <div class="mt-1 flex flex-wrap items-center gap-2 text-sm">
                <span class="inline-flex items-center rounded-full bg-gray-100 text-gray-800 px-2 py-0.5">
                  {{ acc.type || '—' }}
                </span>
                <span v-if="acc.subtype" class="inline-flex items-center rounded-full bg-teal-100 text-teal-800 px-2 py-0.5">
                  {{ acc.subtype }}
                </span>
                <span v-if="acc.balances?.iso_currency_code || acc.balances?.unofficial_currency_code"
                      class="inline-flex items-center rounded-full bg-gray-100 text-gray-700 px-2 py-0.5">
                  {{ acc.balances.iso_currency_code || acc.balances.unofficial_currency_code }}
                </span>
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

            <div class="rounded-xl border border-gray-100 bg-gray-50 p-3">
              <div class="text-xs text-gray-500">Limit</div>
              <div class="text-base font-semibold text-gray-900">
                {{ acc.balances?.limit != null
                    ? fmtMoney(acc.balances.limit, acc.balances?.iso_currency_code || acc.balances?.unofficial_currency_code)
                    : '—' }}
              </div>
            </div>

            <div class="rounded-xl border border-gray-100 bg-gray-50 p-3">
              <div class="text-xs text-gray-500">Account ID</div>
              <div class="text-xs text-gray-700 truncate" :title="acc.account_id">{{ acc.account_id }}</div>
            </div>
          </div>
        </article>
      </div>

      <!-- Empty -->
      <div v-else class="text-center text-gray-600 mt-8">
        <p>No accounts found.</p>
        <RouterLink to="/plaid" class="inline-block mt-2 text-teal-700 underline">Link a bank</RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const accounts = ref([])
const error = ref('')
const loading = ref(false)
const API = import.meta.env.VITE_API_BASE_URL


function fmtMoney(amount, currency) {
  if (amount == null) return '—'
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: currency || 'USD' }).format(amount)
  } catch {
    // Fallback if currency is missing/invalid
    return `${Number(amount).toFixed(2)}${currency ? ' ' + currency : ''}`
  }
}

async function fetchAccounts() {
  error.value = ''
  loading.value = true
  try {
    const res = await fetch(`${API}/api/plaid/accounts`, {
      method: 'GET',
      credentials: 'include'
    })
    const data = await res.json().catch(() => null)
    if (!res.ok) throw new Error(data?.error || data?.message || 'Failed to fetch accounts')
    accounts.value = Array.isArray(data) ? data : []
  } catch (e) {
    error.value = e?.message || 'Failed to fetch accounts'
    accounts.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchAccounts)
</script>

<style scoped>
/* Tailwind handles styling */
</style>
