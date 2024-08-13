// src/app.js
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/authRoutes');
const urlRoutes = require('./routes/urlRoutes');
const { protect } = require('./middleware/authMiddleware');
const urlController = require('./controllers/urlController');

const app = express();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));



// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use('/api/auth', authRoutes);
app.use('/api/urls', protect, urlRoutes); // protect all URL routes

app.use(express.static('public'));
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
  res.render('index', { shortUrl: null, error: null });
});

// Route to render the history page
app.get('/history', urlController.getLinkHistory);

app.get('/analytics', urlController.getAnalytics);




app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.get('/qrcode', (req, res) => {
  res.render('qrcode', { qrCodeUrl: null, error: null });
});

module.exports = app;
