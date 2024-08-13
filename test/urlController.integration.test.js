// tests/urlController.integration.test.js
const request = require('supertest');
const app = require('../src/app');
// const connectToTestDb = require('../testDbConnection');
const Url = require('../src/models/urlModel');
require('dotenv').config();
const mongoose = require('mongoose');


describe('URL Controller Integration', () => {
  let token;

  beforeAll(async () => {
    // Connect to the test database
    await mongoose.connect(process.env.MONGO_URL_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Optionally, obtain a valid JWT token for authorized requests
    const authRes = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'testpassword' });

    token = authRes.body.token;
  });

  afterAll(async () => {
    // Disconnect from the test database
    await mongoose.disconnect();
  });

  afterEach(async () => {
    // Clear the Urls collection
    await Url.deleteMany({});
  });

  it('should shorten a URL', async () => {
    const res = await request(app)
      .post('/api/urls/shorten')
      .set('Authorization', `Bearer ${token}`)
      .send({ originalUrl: '(link unavailable)', customUrl: 'custom123' });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('shortUrl');
  });

  it('should update a shortened URL', async () => {
    const urlRes = await request(app)
      .post('/api/urls/shorten')
      .set('Authorization', `Bearer ${token}`)
      .send({ originalUrl: '(link unavailable)', customUrl: 'custom123' });

    const updateRes = await request(app)
      .patch(`/api/urls/${urlRes.body.shortUrl}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ originalUrl: '(link unavailable)' });

    expect(updateRes.statusCode).toEqual(200);
    expect(updateRes.body).toHaveProperty('shortUrl');
  });

  it('should get URL analytics', async () => {
    const urlRes = await request(app)
      .post('/api/urls/shorten')
      .set('Authorization', `Bearer ${token}`)
      .send({ originalUrl: '(link unavailable)', customUrl: 'custom123' });

    // Simulate some clicks for analytics
    await request(app).get(`/api/urls/${urlRes.body.shortUrl}`);

    const analyticsRes = await request(app)
      .get(`/api/urls/analytics/${urlRes.body.shortUrl}`)
      .set('Authorization', `Bearer ${token}`);

    expect(analyticsRes.statusCode).toEqual(200);
    expect(analyticsRes.body).toHaveProperty('clicks');
    expect(analyticsRes.body).toHaveProperty('lastClicked');
  });

  it('should return 401 for unauthorized requests', async () => {
    const urlRes = await request(app)
      .post('/api/urls/shorten')
      .set('Authorization', `Bearer ${token}`)
      .send({ originalUrl: '(link unavailable)', customUrl: 'custom123' });

    const res = await request(app).get(`/api/urls/analytics/${urlRes.body.shortUrl}`);

    expect(res.statusCode).toEqual(401);
  });
});
