<template>
  <div class="max-w-6xl mx-auto px-4 py-6">
    <header class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <h1 class="text-2xl font-bold">Transactions</h1>
      <div class="flex flex-wrap items-center gap-2">
        <input
          v-model.trim="q"
          type="search"
          placeholder="Search name or category…"
          class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          v-model="start"
          type="date"
          class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          v-model="end"
          type="date"
          class="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          @click="fetchTransactions"
          :disabled="loading"
          class="bg-gray-900 text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition"
        >
          {{ loading ? 'Refreshing…' : 'Refresh' }}
        </button>
      </div>
    </header>

    <div v-if="error" class="bg-red-100 text-red-700 border border-red-300 px-4 py-3 rounded-lg mb-4">
      {{ error }}
    </div>

    <div v-if="sorted.length" class="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
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

    <p v-else-if="!loading && !error" class="text-gray-500 mt-4">No transactions found.</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const API_BASE = 'http://localhost:3000' // e.g. 'http://localhost:3000'

const transactions = ref([])
const loading = ref(false)
const error = ref('')
const q = ref('')
const sort = ref({ key: 'date', dir: 'desc' })
const start = ref('')
const end = ref('')

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
    const res = await fetch('http://localhost:3000/api/plaid/transactions', {
      method: 'GET',
      credentials: 'include',
      headers: { Accept: 'application/json' }
    })
    const data = await res.json().catch(() => null)
    if (!res.ok) throw new Error(data?.error || data?.message || `Request failed (${res.status})`)
    transactions.value = Array.isArray(data) ? data : []
  } catch (e) {
    error.value = e?.message || 'Failed to fetch transactions.'
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
    const va = a[key]
    const vb = b[key]
    if (key === 'date') {
      const da = new Date(va).getTime()
      const db = new Date(vb).getTime()
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
