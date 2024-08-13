// src/controllers/urlController.js
const { createShortUrl, getUrl, incrementClicks, getLinkHistory, getAnalyticsData } = require('../services/urlService');
const redisClient = require('../utils/cache');
const QRCode = require('qrcode');

// Shorten URL
exports.shortenUrl = async (req, res) => {
  const { originalUrl, customUrl } = req.body;
  if (!originalUrl || !customUrl) {
    return res.status(400).send('Original URL and custom URL are required');
  }
  try {
    const shortUrl = await createShortUrl(originalUrl, customUrl);

    // Cache the shortened URL
    await redisClient.set(shortUrl, JSON.stringify({ originalUrl, customUrl }), { EX: 3600 });

    res.status(201).json({ shortUrl });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// Redirect URL
exports.redirectUrl = async (req, res) => {
  const { shortUrl } = req.params;
  try {
    // Check Redis cache first
    const cachedUrl = await redisClient.get(shortUrl);
    if (cachedUrl) {
      const url = JSON.parse(cachedUrl);
      return res.redirect(url.originalUrl);
    }

    const url = await getUrl(shortUrl);
    if (!url) {
      return res.status(404).send('URL not found');
    }

    url.clicks++;
    await url.save();

    // Update cache with new click count
    await redisClient.set(shortUrl, JSON.stringify(url), { EX: 3600 });

    res.redirect(url.originalUrl);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// QR Code Generation
exports.generateQrCode = async (req, res) => {
  const { shortUrl } = req.params;
  if (!shortUrl) {
    return res.render('qrcode', { qrCodeUrl: null, error: 'Short URL is required' });
  }
  try {
    // Check Redis cache first
    const cachedUrl = await redisClient.get(shortUrl);
    let url;
    if (cachedUrl) {
      url = JSON.parse(cachedUrl);
    } else {
      url = await getUrl(shortUrl);
      if (!url) {
        return res.render('qrcode', { qrCodeUrl: null, error: 'Short URL not found' });
      }
      // Cache the URL
      await redisClient.set(shortUrl, JSON.stringify(url), { EX: 3600 });
    }

    const qrCodeUrl = await QRCode.toDataURL(url.shortUrl);
    res.render('qrcode', { qrCodeUrl, error: null });
  } catch (error) {
    console.error(error);
    res.render('qrcode', { qrCodeUrl: null, error: 'An error occurred' });
  }
};

// Get Analytics
exports.getAnalytics = async (req, res) => {
  try {
    const analytics = await getAnalyticsData();

    // Cache the analytics data
    await redisClient.set('analytics', JSON.stringify(analytics), { EX: 3600 });

    if (req.headers['content-type'] === 'application/json') {
      res.json({ analytics });
    } else {
      res.render('analytics', { analytics });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Get Link History
exports.getLinkHistory = async (req, res) => {
  try {
    const urls = await getLinkHistory();

    // Cache the URLs
    await redisClient.set('linkHistory', JSON.stringify(urls), { EX: 3600 });

    if (req.headers['content-type'] === 'application/json') {
      res.json({ urls });
    } else {
      res.render('history', { urls });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};



