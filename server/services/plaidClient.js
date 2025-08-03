const plaid = require('plaid');
require('dotenv').config();

const configuration = new plaid.Configuration({
  basePath: plaid.PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const client = new plaid.PlaidApi(configuration);

module.exports = client;