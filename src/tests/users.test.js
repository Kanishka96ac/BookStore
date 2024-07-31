const mongoose = require('mongoose');
const User = require('../models/user');
const app = require('../../index'); // Ensure this path is correct
const request = require('supertest');

// Connect to the test database before running any tests
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST);
});

// Clean up and close the connection after all tests are done
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

// Define test suite for the User model
describe('User Model Test', () => {
  it('should create a user successfully', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
        role: 'user',
      });
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Test User');
  });

  // Add more tests as needed
});
