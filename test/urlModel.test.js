// src/tests/urlModel.test.js
const mongoose = require('mongoose');
const Url = require('../src/models/urlModel');

describe('URL Model', () => {
  // ...

  it('should create a URL with automatically generated shortUrl', async () => {
    const url = new Url({ longUrl: '(link unavailable)' });
    const savedUrl = await url.save();
    expect(savedUrl._id).toBeDefined();
    expect(savedUrl.longUrl).toBe('(link unavailable)');
    expect(savedUrl.shortUrl).toBeDefined();
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
});

