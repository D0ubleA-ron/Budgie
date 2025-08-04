<template>
  <div>
    <button @click="launchPlaid" :disabled="!ready">Link Bank Account</button>

    <!-- Show linked accounts -->
    <div v-if="accounts.length" style="margin-top: 20px;">
      <h3>Linked Accounts:</h3>
      <ul>
        <li v-for="acc in accounts" :key="acc.account_id">
          {{ acc.name }} — {{ acc.subtype }} — {{ acc.balances.current }} {{ acc.balances.iso_currency_code }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      linkToken: null,
      plaidHandler: null,
      ready: false,
      accounts: [],
    };
  },
  methods: {
    async fetchLinkToken() {
      try {
        const response = await fetch('http://localhost:3000/api/plaid/create-link-token', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        this.linkToken = data.link_token;
        this.initializePlaid();
      } catch (error) {
        console.error('Failed to get link token', error);
      }
    },
    initializePlaid() {
      this.plaidHandler = window.Plaid.create({
        token: this.linkToken,
        onSuccess: async (public_token, metadata) => {
          console.log('✅ Public Token:', public_token);

          // Exchange token
          const exchangeRes = await fetch('http://localhost:3000/api/plaid/exchange-public-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ public_token }),
          });

          if (exchangeRes.ok) {
            // Fetch account data
            const accountRes = await fetch('http://localhost:3000/api/plaid/accounts');
            const accountData = await accountRes.json();
            this.accounts = accountData;
            console.log('🏦 Linked Accounts:', accountData);
          } else {
            console.error('❌ Failed to exchange token');
          }
        },
        onExit: (err, metadata) => {
          console.log('Exited Plaid Link', err, metadata);
        },
      });
      this.ready = true;
    },
    launchPlaid() {
      if (this.plaidHandler) {
        this.plaidHandler.open();
      }
    },
  },
  mounted() {
    this.fetchLinkToken();
  },
};
</script>
