const mongoose = require('mongoose');
const Book = require('../models/book');
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

// Define test suite for the Book model
describe('Book Model Test', () => {
  it('should create a book successfully', async () => {
    const response = await request(app)
      .post('/books')
      .send({
        title: 'Test Book',
        author: 'Test Author',
        price: 19.99,
        stock: 100,
      });
    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Test Book');
  });
});
