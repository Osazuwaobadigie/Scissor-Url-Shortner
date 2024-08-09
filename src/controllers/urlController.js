// src/controllers/urlController.js
const { createShortUrl, getUrl, incrementClicks, getLinkHistory, getAnalyticsData } = require('../services/urlService');

// shortenUrl

exports.shortenUrl = async (req, res) => {
  const { originalUrl, customUrl } = req.body;
  if (!originalUrl || !customUrl) {
    return res.status(400).send('Original URL and custom URL are required');
  }
  try {
    const shortUrl = await createShortUrl(originalUrl, customUrl);
    res.status(201).json({ shortUrl });
  } catch (error) {
    res.status(400).send(error.message);
  }
};


// redirectUrl

exports.redirectUrl = async (req, res) => {
  const { shortUrl } = req.params;
  try {
    const url = await getUrl(shortUrl);
    if (!url) {
      return res.status(404).send('URL not found');
    }
    url.clicks++;
    await url.save();
    res.redirect(url.originalUrl);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};





//QR Code Generation

const QRCode = require('qrcode');

exports.generateQrCode = async (req, res) => {
  const shortUrl = req.params.shortUrl;
  if (!shortUrl) {
    return res.render('qrcode', { qrCodeUrl: null, error: 'Short URL is required' });
  }
  try {
    const url = await getUrl(shortUrl);
    if (!url) {
      return res.render('qrcode', { qrCodeUrl: null, error: 'Short URL not found' });
    }
    try {
      const qrCodeUrl = await QRCode.toDataURL(url.shortUrl);
      res.render('qrcode', { qrCodeUrl, error: null });
    } catch (err) {
      return res.render('qrcode', { qrCodeUrl: null, error: 'Failed to generate QR code' });
    }
  } catch (error) {
    console.error(error);
    res.render('qrcode', { qrCodeUrl: null, error: 'An error occurred' });
  }
};













// getAnalytics

exports.getAnalytics = async (req, res) => {
  try {
    const analytics = await getAnalyticsData(); // Assuming you have a service function to get analytics data

    // Check if the request expects a JSON response
    if (req.headers['content-type'] === 'application/json') {
      res.json({ analytics });
    } else {
      // Otherwise, render the EJS template
      res.render('analytics', { analytics });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};








//Link History
// src/controllers/urlController.js
//getLinkHistory

exports.getLinkHistory = async (req, res) => {
  try {
    const urls = await getLinkHistory(); // Fetch the URLs

    // Check if the request expects a JSON response
    if (req.headers['content-type'] === 'application/json') {
      res.json({ urls });
    } else {
      // Otherwise, render the EJS template
      res.render('history', { urls });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};



