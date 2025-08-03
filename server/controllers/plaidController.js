const client = require('../services/plaidClient');

let ACCESS_TOKEN = null; // temporary store

const createLinkToken = async (req, res) => {
  try {
    const response = await client.linkTokenCreate({
      user: { client_user_id: 'user-123' },
      client_name: 'Budgie',
      products: ['auth', 'transactions'],
      country_codes: ['US', 'CA'],
      language: 'en',
    });
    res.json({ link_token: response.data.link_token });
  } catch (error) {
    console.error('Error creating link token:', error);
    res.status(500).json({ error: 'Unable to create link token' });
  }
};

const exchangePublicToken = async (req, res) => {
  const { public_token } = req.body;
  try {
    const response = await client.itemPublicTokenExchange({ public_token });
    ACCESS_TOKEN = response.data.access_token; // 💾 Save in memory
    const item_id = response.data.item_id;
    res.json({ access_token: ACCESS_TOKEN, item_id });
  } catch (error) {
    console.error('Error exchanging public token:', error);
    res.status(500).json({ error: 'Token exchange failed' });
  }
};

const getAccounts = async (req, res) => {
  try {
    if (!ACCESS_TOKEN) {
      return res.status(400).json({ error: 'Access token not set yet' });
    }
    const response = await client.authGet({ access_token: ACCESS_TOKEN });
    res.json(response.data.accounts);
  } catch (error) {
    console.error('getAccounts error:', error);
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
};

const getTransactions = async (req, res) => {
  try {
    if (!ACCESS_TOKEN) {
      return res.status(400).json({ error: 'Access token not set yet' });
    }
    const response = await client.transactionsGet({
      access_token: ACCESS_TOKEN,
      start_date: '2024-01-01',
      end_date: '2024-12-31',
      options: { count: 10, offset: 0 },
    });
    res.json(response.data.transactions);
  } catch (error) {
    console.error('getTransactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

module.exports = {
  createLinkToken,
  exchangePublicToken,
  getAccounts,
  getTransactions,
};
