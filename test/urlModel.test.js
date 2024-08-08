// src/tests/urlModel.test.js
const mongoose = require('mongoose');
const Url = require('../models/urlModel');

describe('URL Model', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await Url.deleteMany({});
  });

  it('should create a URL', async () => {
    const url = new Url({ longUrl: 'https://example.com', shortUrl: 'abc123' });
    const savedUrl = await url.save();

    expect(savedUrl._id).toBeDefined();
    expect(savedUrl.longUrl).toBe('https://example.com');
    expect(savedUrl.shortUrl).toBe('abc123');
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
  });
});
