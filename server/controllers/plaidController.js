const jwt = require('jsonwebtoken');
const { PrismaClient } = require('../generated/prisma');
const client = require('../services/plaidClient');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

const createLinkToken = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: 'Missing auth token' });
    }

    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload?.userId) {
      return res.status(400).json({ error: 'Invalid token payload' });
    }

    const response = await client.linkTokenCreate({
      user: { client_user_id: payload.userId },
      client_name: 'Budgie',
      products: ['auth', 'transactions'],
      country_codes: ['US', 'CA'],
      language: 'en',
    });

    res.json({ link_token: response.data.link_token });
  } catch (error) {
    console.error('Error creating link token:', error?.response?.data || error.message || error);
    res.status(500).json({ error: 'Unable to create link token' });
  }
};

const exchangePublicToken = async (req, res) => {
  const { public_token } = req.body;

  try {
    const token = req.cookies.token;
    const payload = jwt.verify(token, JWT_SECRET);

    const response = await client.itemPublicTokenExchange({ public_token });
    const access_token = response.data.access_token;

    await prisma.user.update({
      where: { id: payload.userId },
      data: { accessToken: access_token },
    });

    res.json({ item_id: response.data.item_id });
  } catch (error) {
    console.error('Error exchanging public token:', error);
    res.status(500).json({ error: 'Token exchange failed' });
  }
};

const getAccounts = async (req, res) => {
  try {
    const token = req.cookies.token;
    const payload = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || !user.accessToken) {
      return res.status(400).json({ error: 'No access token linked to user' });
    }

    const response = await client.authGet({ access_token: user.accessToken });
    res.json(response.data.accounts);
  } catch (error) {
    console.error('getAccounts error:', error);
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
};

const getTransactions = async (req, res) => {
  try {
    const token = req.cookies.token;
    const payload = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || !user.accessToken) {
      return res.status(400).json({ error: 'No access token linked to user' });
    }

    const response = await client.transactionsGet({
      access_token: user.accessToken,
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
