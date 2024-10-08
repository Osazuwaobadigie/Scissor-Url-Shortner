// src/services/urlService.js
const Url = require('../models/urlModel');
const shortid = require('shortid');
const validUrl = require('valid-url');

// Create short URL
exports.createShortUrl = async (originalUrl, customUrl) => {
  if (!validUrl.isUri(originalUrl)) throw new Error('Invalid URL');
  const shortUrl = customUrl || shortid.generate();
  const newUrl = new Url({ originalUrl, shortUrl, customUrl });
  await newUrl.save();
  return shortUrl;
};

// Get URL
exports.getUrl = async (shortUrl) => {
  const url = await Url.findOne({ shortUrl });
  if (!url) throw new Error('URL not found');
  return url;
};

// Increment clicks
exports.incrementClicks = async (shortUrl) => {
  const url = await Url.findOne({ shortUrl });
  if (url) {
    url.clicks += 1;
    await url.save();
  }
};

// Get link history 
exports.getLinkHistory = async (originalUrl) => {
  const urls = await Url.find({ originalUrl }).sort({ createdAt: -1 });
  return urls;
};


// Get analytics data
exports.getAnalyticsData = async () => {
  try {
    const urls = await Url.find().sort({ clicks: -1 });
    const analyticsData = urls.map((url) => ({
      shortUrl: url.shortUrl,
      originalUrl: url.originalUrl,
      clicks: url.clicks,
    }));
    return analyticsData;
  } catch (err) {
    throw err;
  }
};

