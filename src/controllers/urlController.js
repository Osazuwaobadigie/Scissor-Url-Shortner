// src/controllers/urlController.js
const { createShortUrl, getUrl, incrementClicks, getLinkHistory } = require('../services/urlService');

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
  const shortUrlId = req.body.shortUrlId;
  if (!shortUrlId) {
    return res.render('qrcode', { qrCodeUrl: null, error: 'Short URL ID is required' });
  }
  try {
    const url = await Url.findById(shortUrlId);
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



// get Analytics


exports.getAnalytics = async (req, res) => {
  const { shortUrl } = req.params;
  const url = await getUrl(shortUrl);
  if (!url) {
    return res.status(404).send('URL not found');
  }
  res.json({ clicks: url.clicks });
};








//Link History
// src/controllers/urlController.js
//getLinkHistory

exports.getLinkHistory = async (req, res) => {
  const urls = await getLinkHistory(); // Use the service instead of the model
  res.render('history', { urls });
};

