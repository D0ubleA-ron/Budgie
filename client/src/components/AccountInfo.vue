<template>
  <div>
    <button @click="fetchAccounts" :disabled="loading">
      {{ loading ? 'Loading accounts...' : 'Get Accounts' }}
    </button>

    <ul v-if="accounts.length">
      <li v-for="acc in accounts" :key="acc.account_id">
        <strong>{{ acc.name }}</strong> — {{ acc.subtype }} — 
        {{ acc.balances.current }} {{ acc.balances.iso_currency_code }}
      </li>
    </ul>

    <p v-if="error" style="color: red">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const accounts = ref([])
const error = ref('')
const loading = ref(false)

const fetchAccounts = async () => {
  error.value = ''
  loading.value = true

  try {
    const response = await fetch('http://localhost:3000/api/plaid/accounts', {
      method: 'GET',
      credentials: 'include', 
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch accounts')
    }

    accounts.value = data
  } catch (err) {
    error.value = err.message
    accounts.value = []
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
button {
  padding: 8px 12px;
  margin-bottom: 16px;
}
</style>
