/ src/tests/urlController.test.js
const request = require('supertest');
const app = require('../app');
const { expect } = require('chai');

describe('URL Shortening', () => {
  it('should create a short URL', async () => {
    const res = await request(app)
      .post('/shorten')
      .send({ originalUrl: 'https://example.com' });
  });
});
