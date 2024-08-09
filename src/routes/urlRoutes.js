// src/routes/urlRoutes.js
const express = require('express');
const router = express.Router();
const { shortenUrl, redirectUrl, getAnalytics, getLinkHistory, generateQrCode } = require('../controllers/urlController');
const { authorize } = require('../middleware/authMiddleware');


router.post('/shorten', shortenUrl);
router.get('/analytics/:shortUrl', getAnalytics);
router.get('/history', getLinkHistory);
router.get('/generate-qrcode/:shortUrl', generateQrCode); 
router.get('/:shortUrl', redirectUrl);

module.exports = router;
