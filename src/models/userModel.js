// src/models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }, // default role is user
}, { timestamps: true });

userSchema.index({ username: 1 }); // Index for username
userSchema.index({ email: 1 }); // Index for email

module.exports = mongoose.model('User', userSchema);
