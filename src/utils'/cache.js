// src/utils/cache.js
const redis = require('redis');
const client = redis.createClient();

client.on('error', (err) => console.log('Redis Client Error', err));
client.connect();

exports.getCache = async (key) => {
  return await client.get(key);
};

exports.setCache = async (key, value) => {
  await client.set(key, value, 'EX', 3600);
};
