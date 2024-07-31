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
describe('Book API', () => {
  let bookId;

  // Test case for creating a book
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
    bookId = response.body._id; // Store the bookId for later tests
  });

  // Test case for getting a list of books
  it('should fetch all books', async () => {
    const response = await request(app).get('/books');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0); // Ensure there is at least one book
  });

  // Test case for getting a single book by ID
  it('should fetch a book by ID', async () => {
    const response = await request(app).get(`/books/${bookId}`);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Test Book');
  });

  // Test case for updating a book
  it('should update a book by ID', async () => {
    const response = await request(app)
      .put(`/books/${bookId}`)
      .send({
        title: 'Updated Test Book',
        author: 'Updated Test Author',
        price: 29.99,
        stock: 150,
      });
    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Updated Test Book');
  });

  // Test case for deleting a book
  it('should delete a book by ID', async () => {
    const response = await request(app).delete(`/books/${bookId}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Book deleted successfully');
    
    // Verify that the book has been deleted
    const checkResponse = await request(app).get(`/books/${bookId}`);
    expect(checkResponse.status).toBe(404);
    expect(checkResponse.body.message).toBe('Book not found');
  });
});
