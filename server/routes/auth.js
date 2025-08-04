const express = require('express');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('../generated/prisma');
const router = express.Router();

const prisma = new PrismaClient();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ id: user.id, email: user.email });
  } catch (err) {
    if (err.code === 'P2002') {
      res.status(400).json({ error: 'User already exists' });
    } else {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

module.exports = router;
