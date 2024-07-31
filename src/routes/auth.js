// routes/auth.js
const express = require('express');
const User = require('../models/user');
const router = new express.Router();
const auth = require('../middleware/auth');

// Sign Up Route
router.post('/signup', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (err) {
    res.status(400).send(err);
  }
});

// Log In Route
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await user.comparePassword(req.body.password))) {
      return res.status(400).send({ error: 'Invalid credentials' });
    }
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (err) {
    res.status(500).send(err);
  }
});

// routes/auth.js
//Refresh Token: Generates a new token for the authenticated user.
router.post('/refresh', auth, async (req, res) => {
    try {
      const token = await req.user.generateAuthToken();
      res.send({ token });
    } catch (err) {
      res.status(500).send(err);
    }
  });
  


module.exports = router;
