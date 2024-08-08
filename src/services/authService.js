// src/services/authService.js
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

exports.registerUser = async (username, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = new User({ username, email, password: hashedPassword });
  await newUser.save();
  return newUser;
};

exports.loginUser = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user) throw new Error('User not found');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Incorrect password');

  const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  return { token, user };
};
