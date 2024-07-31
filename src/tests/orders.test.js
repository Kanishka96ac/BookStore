const mongoose = require('mongoose');
const Order = require('../models/order');
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

// Define test suite for the Order model
describe('Order Model Test', () => {
  it('should create an order successfully', async () => {
    const response = await request(app)
      .post('/orders')
      .send({
        bookId: '60d5f480e5861b001f647e62', // Replace with a valid bookId from your test database
        quantity: 2,
        totalPrice: 39.98,
        status: 'pending',
      });
    expect(response.status).toBe(201);
    expect(response.body.status).toBe('pending');
  });

  // Add more tests as needed
});
