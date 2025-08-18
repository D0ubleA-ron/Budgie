const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const plaidRoutes = require('./routes/plaidRoutes');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const app = express();

dotenv.config();
app.use(cors({
  origin: process.env.CORS_ORIGINS, 
  credentials: true               
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/plaid', plaidRoutes);
app.use('/api/auth', authRoutes);


app.get('/', (req, res) => {
  res.send('Backend is running 🎉');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(process.env.CORS_ORIGINS)
});
