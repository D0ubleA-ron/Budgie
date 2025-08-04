<template>
  <div>
    <button @click="preparePlaid" :disabled="!ready">Link Bank Account</button>

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
      ready: true,
      accounts: [],
    };
  },
  methods: {
    async preparePlaid() {
      try {
        const response = await fetch('http://localhost:3000/api/plaid/create-link-token', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Failed to fetch link token');

        this.linkToken = data.link_token;

        this.plaidHandler = window.Plaid.create({
          token: this.linkToken,
          onSuccess: async (public_token, metadata) => {
            console.log('✅ Public Token:', public_token);

            const exchangeRes = await fetch('http://localhost:3000/api/plaid/exchange-public-token', {
              method: 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ public_token }),
            });

            if (exchangeRes.ok) {
              const accountRes = await fetch('http://localhost:3000/api/plaid/accounts', {
                credentials: 'include'
              });
              const accountData = await accountRes.json();
              this.accounts = accountData;
            } else {
              console.error('❌ Failed to exchange token');
            }
          },
          onExit: (err, metadata) => {
            console.log('Exited Plaid Link', err, metadata);
          },
        });

        this.plaidHandler.open();
      } catch (err) {
        console.error('Plaid flow error:', err);
      }
    },
  },
};
</script>
