// src/tests/urlController.integration.test.js
const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/userModel');
const Url = require('../src/models/urlModel');

describe('URL Controller Integration', () => {
  // ...

  it('should shorten a URL', async () => {
    // ...
  });

  it('should update a shortened URL', async () => {
    const urlRes = await request(app)
      .post('/api/urls/shorten')
      .set('Authorization', `Bearer ${token}`)
      .send({ longUrl: '(link unavailable)' });

    const updateRes = await request(app)
      .patch(`/api/urls/${urlRes.body.shortUrl}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ longUrl: '(link unavailable)' });

    expect(updateRes.statusCode).toEqual(200);
    expect(updateRes.body).toHaveProperty('shortUrl');
  });

  it('should get URL analytics', async () => {
    // ...

    expect(res.body).toHaveProperty('clicks');
    expect(res.body).toHaveProperty('lastClicked');
  });

  it('should return 401 for unauthorized requests', async () => {
    const res = await request(app)
      .get(`/api/urls/analytics/${urlRes.body.shortUrl}`);

    expect(res.statusCode).toEqual(401);
  });
});


