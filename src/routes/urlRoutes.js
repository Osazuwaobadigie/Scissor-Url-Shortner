// src/routes/urlRoutes.js
const express = require('express');
const router = express.Router();
const { shortenUrl, redirectUrl, getAnalytics, getLinkHistory, generateQrCode } = require('../controllers/urlController');
const { authorize } = require('../middleware/authMiddleware');

router.post('/shorten', shortenUrl);
router.get('/:shortUrl', redirectUrl);
router.get('/analytics/:shortUrl', getAnalytics);
router.get('/history', getLinkHistory);
router.post('/qrcode/:shortUrl', generateQrCode);

module.exports = router;
