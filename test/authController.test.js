// src/tests/authController.test.js
const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/userModel');

describe('Auth Controller', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it('registers a new user with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

    expect(response.statusCode).toEqual(201);
    expect(response.body.user).toHaveProperty('_id');
  });

  it('fails to register with existing username', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test2@example.com',
        password: 'password123',
      });

    expect(response.statusCode).toEqual(400);
  });

  it('logs in a user with valid credentials', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'password123',
      });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty('token');
  });

  it('fails to register with missing fields', async () => {
  const response = await request(app)
    .post('/api/auth/register')
    .send({
      username: 'testuser',
      // email is missing
      password: 'password123',
    });

  expect(response.statusCode).toEqual(400);
  expect(response.body.errors[0].msg).toEqual('Email is required');
});


  it('fails to log in with invalid password', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'wrongpassword',
      });

    expect(response.statusCode).toEqual(401);
  });
});
