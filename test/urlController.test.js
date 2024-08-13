/ src/tests/urlController.test.js
const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const Url = require('../src/models/urlModel');
const redisClient = require('../utils/cache');
const { expect } = require('chai');

jest.mock('../utils/cache', () => ({
  get: jest.fn(),
  set: jest.fn(),
}));

describe('URL Shortening', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a short URL', async () => {
    const res = await request(app)
      .post('/shorten')
      .send({ originalUrl: 'http://example.com', customUrl: 'exmpl' });

    expect(res.statusCode).to.equal(201);
    expect(res.body).to.have.property('shortUrl');
    expect(redisClient.set).toHaveBeenCalled();
  });

  it('should return 400 for invalid URL', async () => {
    const res = await request(app)
      .post('/shorten')
      .send({ originalUrl: 'invalid-url', customUrl: 'invalid' });

    expect(res.statusCode).to.equal(400);
  });

  it('should return 400 for missing original URL', async () => {
    const res = await request(app)
      .post('/shorten')
      .send({ customUrl: 'exmpl' });

    expect(res.statusCode).to.equal(400);
  });

  it('should return 400 for missing custom URL', async () => {
    const res = await request(app)
      .post('/shorten')
      .send({ originalUrl: 'http://example.com' });

    expect(res.statusCode).to.equal(400);
  });

  it('should redirect to the original URL', async () => {
    const res = await request(app)
      .get('/r/exmpl');

    expect(res.statusCode).to.equal(302);
    expect(res.headers.location).to.equal('http://example.com');
    expect(redisClient.get).toHaveBeenCalled();
  });
});
