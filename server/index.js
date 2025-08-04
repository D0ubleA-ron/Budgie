const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const plaidRoutes = require('./routes/plaidRoutes');
const authRoutes = require('./routes/auth');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/plaid', plaidRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Backend is running 🎉');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
