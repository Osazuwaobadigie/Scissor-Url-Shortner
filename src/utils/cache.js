// src/utils/cache.js
const redis = require('redis');

const client = redis.createClient({
  url: 'redis://localhost:6379',
});

client.on('error', (err) => {
  console.error('Redis client error', err);
});

client.connect();

module.exports = client;