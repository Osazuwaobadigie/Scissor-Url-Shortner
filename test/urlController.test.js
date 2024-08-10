/ src/tests/urlController.test.js
const request = require('supertest');
const app = require('../src/app');
const { expect } = require('chai');

describe('URL Shortening', () => {
  it('should create a short URL', async () => {
    const res = await request(app)
      .post('/shorten')
      .send({ originalUrl: '(link unavailable)' });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('shortUrl');
  });

  it('should return 400 for invalid URL', async () => {
    const res = await request(app)
      .post('/shorten')
      .send({ originalUrl: 'invalid-url' });

    expect(res.statusCode).toEqual(400);
  });

  it('should return 409 for already shortened URL', async () => {
    const res1 = await request(app)
      .post('/shorten')
      .send({ originalUrl: '(link unavailable)' });

    const res2 = await request(app)
      .post('/shorten')
      .send({ originalUrl: '(link unavailable)' });

    expect(res2.statusCode).toEqual(409);
  });

  it('should return 400 for missing URL', async () => {
    const res = await request(app)
      .post('/shorten')
      .send({});

    expect(res.statusCode).toEqual(400);
  });
});


