// testDbConnection.js
const mongoose = require('mongoose');

const connectToTestDb = () => {
  const dbUri = process.env.MONGODB_URI_TEST; // Ensure this is set in your environment variables

  mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to test database'))
  .catch((error) => console.error('Database connection error:', error));
};

module.exports = connectToTestDb;
