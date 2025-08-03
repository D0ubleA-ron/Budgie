const express = require('express');
const router = express.Router();
const plaidController = require('../controllers/plaidController');

router.post('/create-link-token', plaidController.createLinkToken);
router.post('/exchange-public-token', plaidController.exchangePublicToken);
router.get('/accounts', plaidController.getAccounts);
router.get('/transactions', plaidController.getTransactions);

module.exports = router;