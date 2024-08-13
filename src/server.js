// src/server.js
require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;
const redis = require('./utils/cache');

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    console.log('redis is connected')
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB', error);
  });
