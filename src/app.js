// src/app.js
const express = require('express');
const mongoose = require('mongoose');
//const cors = require('cors');
//const morgan = require('morgan');
//const helmet = require('helmet');
//const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/authRoutes');
const urlRoutes = require('./routes/urlRoutes');
const { protect } = require('./middleware/authMiddleware');

const app = express();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(cors());
//app.use(morgan('dev'));
//app.use(helmet());

// Rate limiting
//const limiter = rateLimit({
  //windowMs: 15 * 60 * 1000, // 15 minutes
  //max: 100 // limit each IP to 100 requests per windowMs
//});
//app.use(limiter);

app.use('/api/auth', authRoutes);
app.use('/api/urls', protect, urlRoutes); // protect all URL routes

app.use(express.static('public'));
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
  res.render('index', { shortUrl: null, error: null });
});

// Route to render the history page
app.get('/history', async (req, res) => {
  try {
    const urls = await Url.find();
    if (!urls || !Array.isArray(urls)) {
      throw new Error('Invalid URLs response');
    }
    res.render('history', { urls });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});



app.get('/analytics', (req, res) => {
  // Fetch analytics data if needed
  res.render('analytics', { analytics: [] }); // Pass the actual analytics data instead of an empty array
});

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
