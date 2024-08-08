// src/tests/urlController.integration.test.js
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const Url = require('../models/urlModel');

describe('URL Controller Integration', () => {
  let token;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', email: 'test@example.com', password: 'password123' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'password123' });

    token = res.body.token;
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await Url.deleteMany({});
  });

  it('should shorten a URL', async () => {
    const res = await request(app)
      .post('/api/urls/shorten')
      .set('Authorization', `Bearer ${token}`)
      .send({ longUrl: 'https://example.com' });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('shortUrl');
  });

  it('should get URL analytics', async () => {
    const urlRes = await request(app)
      .post('/api/urls/shorten')
      .set('Authorization', `Bearer ${token}`)
      .send({ longUrl: 'https://example.com' });

    const res = await request(app)
      .get(`/api/urls/analytics/${urlRes.body.shortUrl}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('clicks');
  });
});
