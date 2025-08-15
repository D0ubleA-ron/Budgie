<template>
  <div class="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-teal-50 to-white">
    <section class="max-w-6xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Transactions</h1>
          <p class="text-sm text-gray-600">
            Search, sort, and filter your recent activity.
          </p>
        </div>

        <!-- Filters / Actions -->
        <div class="flex flex-wrap items-center gap-2">
          <input
            v-model.trim="q"
            type="search"
            placeholder="Search name or category…"
            class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <input
            v-model="start"
            type="date"
            class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <input
            v-model="end"
            type="date"
            class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            @click="fetchTransactions"
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
      </div>

      <!-- Skeleton (first load) -->
      <div v-if="loading && !transactions.length" class="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div class="p-4">
          <div class="animate-pulse space-y-3">
            <div class="h-5 w-48 bg-gray-200 rounded"></div>
            <div class="h-40 w-full bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div v-else-if="sorted.length" class="overflow-x-auto border border-gray-200 rounded-xl shadow-sm bg-white">
        <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div class="text-sm text-gray-600">
            Showing <span class="font-medium text-gray-900">{{ sorted.length }}</span> transactions
          </div>
        </div>
        <table class="min-w-full text-sm">
          <thead class="bg-gray-50">
            <tr>
              <th @click="sortBy('date')" class="px-4 py-2 text-left font-semibold cursor-pointer">
                Date <span v-if="sort.key==='date'">{{ sort.dir==='asc' ? '▲' : '▼' }}</span>
              </th>
              <th @click="sortBy('name')" class="px-4 py-2 text-left font-semibold cursor-pointer">
                Name <span v-if="sort.key==='name'">{{ sort.dir==='asc' ? '▲' : '▼' }}</span>
              </th>
              <th @click="sortBy('amount')" class="px-4 py-2 text-left font-semibold cursor-pointer">
                Amount <span v-if="sort.key==='amount'">{{ sort.dir==='asc' ? '▲' : '▼' }}</span>
              </th>
              <th class="px-4 py-2 text-left font-semibold">Category</th>
              <th class="px-4 py-2 text-left font-semibold">Account</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="t in sorted"
              :key="t.transaction_id"
              class="odd:bg-white even:bg-gray-50 hover:bg-gray-100"
            >
              <td class="px-4 py-2 whitespace-nowrap">{{ t.date }}</td>
              <td class="px-4 py-2 whitespace-nowrap">{{ t.name }}</td>
              <td class="px-4 py-2 whitespace-nowrap">
                {{ formatAmount(t.amount, t.iso_currency_code || t.unofficial_currency_code) }}
              </td>
              <td class="px-4 py-2 whitespace-nowrap">
                {{ (t.category && t.category.join(' › ')) || '—' }}
              </td>
              <td class="px-4 py-2 whitespace-nowrap">{{ t.account_id }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty -->
      <p v-else class="text-center text-gray-600 mt-8">
        No transactions found.
      </p>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const transactions = ref([])
const loading = ref(false)
const error = ref('')

const q = ref('')
const start = ref('')
const end = ref('')

const sort = ref({ key: 'date', dir: 'desc' })

function formatAmount(amount, currency) {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: currency || 'USD' }).format(amount)
  } catch {
    return `${Number(amount).toFixed?.(2) ?? amount} ${currency || ''}`.trim()
  }
}

async function fetchTransactions() {
  loading.value = true
  error.value = ''
  try {
    // Build a direct URL to localhost:3000, adding start/end if provided
    const qs = new URLSearchParams()
    if (start.value) qs.set('start', start.value)
    if (end.value)   qs.set('end', end.value)
    const url = `http://localhost:3000/api/plaid/transactions${qs.toString() ? `?${qs}` : ''}`

    const res = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: { Accept: 'application/json' }
    })
    const data = await res.json().catch(() => null)
    if (!res.ok) throw new Error(data?.error || data?.message || `Request failed (${res.status})`)
    transactions.value = Array.isArray(data) ? data : []
  } catch (e) {
    error.value = e?.message || 'Failed to fetch transactions.'
    transactions.value = []
  } finally {
    loading.value = false
  }
}

const filtered = computed(() => {
  if (!q.value) return transactions.value
  const needle = q.value.toLowerCase()
  return transactions.value.filter(t => {
    const name = (t.name || '').toLowerCase()
    const cats = (t.category || []).join(' ').toLowerCase()
    return name.includes(needle) || cats.includes(needle)
  })
})

const sorted = computed(() => {
  const arr = [...filtered.value]
  const { key, dir } = sort.value
  arr.sort((a, b) => {
    const va = a[key], vb = b[key]
    if (key === 'date') {
      const da = new Date(va).getTime(), db = new Date(vb).getTime()
      return dir === 'asc' ? da - db : db - da
    }
    if (key === 'amount') return dir === 'asc' ? va - vb : vb - va
    return dir === 'asc'
      ? String(va).localeCompare(String(vb))
      : String(vb).localeCompare(String(va))
  })
  return arr
})

function sortBy(key) {
  if (sort.value.key === key) {
    sort.value.dir = sort.value.dir === 'asc' ? 'desc' : 'asc'
  } else {
    sort.value.key = key
    sort.value.dir = key === 'date' ? 'desc' : 'asc'
  }
}

onMounted(fetchTransactions)
</script>

<style scoped>
/* Tailwind handles styling */
</style>
