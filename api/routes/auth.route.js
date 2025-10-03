// routes/auth.js
const express = require('express');
const router = express.Router();
const {
  register,
  login,
  profile,
  logout,
} = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', profile);
router.post('/logout', logout);

module.exports = router;
