// tests/urlModel.test.js
const mongoose = require('mongoose');
const Url = require('../src/models/urlModel');
require('dotenv').config();

const MONGO_URL_TEST = process.env.MONGO_URL_TEST;

describe('URL Model', () => {
  beforeAll(async () => {
    // Connect to the test database
    await mongoose.connect(MONGO_URL_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Disconnect from the test database
    await mongoose.disconnect();
  });

  afterEach(async () => {
    // Clear the URLs collection
    await Url.deleteMany({});
  });

  it('should create a URL with required fields', async () => {
    const url = new Url({ originalUrl: '(link unavailable)', shortUrl: 'short123' });
    const savedUrl = await url.save();

    expect(savedUrl._id).toBeDefined();
    expect(savedUrl.originalUrl).toBe('(link unavailable)');
    expect(savedUrl.shortUrl).toBe('short123');
  });

  it('should fail to create a URL without required fields', async () => {
    const url = new Url({});
    let err;
    try {
      await url.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.message).toContain('Url validation failed');
  });

  it('should fail to create a URL with duplicate shortUrl', async () => {
    const url1 = new Url({ originalUrl: '(link unavailable)', shortUrl: 'duplicate123' });
    await url1.save();

    const url2 = new Url({ originalUrl: '(link unavailable)', shortUrl: 'duplicate123' });
    let err;
    try {
      await url2.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.message).toContain('duplicate key error');
  });

  it('should set clicks to 0 by default', async () => {
    const url = new Url({ originalUrl: '(link unavailable)', shortUrl: 'short123' });
    const savedUrl = await url.save();

    expect(savedUrl.clicks).toBe(0);
  });

  it('should allow optional customUrl', async () => {
    const url = new Url({ originalUrl: '(link unavailable)', shortUrl: 'short123', customUrl: 'custom123' });
    const savedUrl = await url.save();

    expect(savedUrl.customUrl).toBe('custom123');
  });
});
