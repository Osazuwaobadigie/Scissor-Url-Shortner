// src/controllers/authController.js
const { registerUser, loginUser } = require('../services/authService');
const { validationResult } = require('express-validator');

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { username, email, password } = req.body;
  try {
    const user = await registerUser(username, email, password);
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { username, password } = req.body;
  try {
    const { token, user } = await loginUser(username, password);
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
