// src/models/urlModel.js
const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  customUrl: { type: String, unique: true },
  clicks: { type: Number, default: 0 },
}, { timestamps: true });

const Url = mongoose.model('Url', urlSchema);

module.exports = Url;