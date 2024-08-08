// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { register, login } = require('../controllers/authController');

router.post('/register', [
  check('username', 'Username is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
], register);

router.post('/login', [
  check('username', 'Username is required').not().isEmpty(),
  check('password', 'Password is required').exists(),
], login);

module.exports = router;
