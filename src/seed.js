const mongoose = require('mongoose');
const Book = require('./models/book'); 


const mongoURI = 'mongodb+srv://kanishka:bookstore%23@bookstore-online.ssex6eh.mongodb.net/?retryWrites=true&w=majority&appName=bookstore-online';

// Connect to MongoDB
mongoose.connect(mongoURI);

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

// Sample data
const sampleBooks = [
    {
      title: 'JavaScript: The Good Parts',
      author: 'Douglas Crockford',
      price: 29.99,
      stock: 10
    },
    {
      title: 'Eloquent JavaScript',
      author: 'Marijn Haverbeke',
      price: 39.99,
      stock: 15
    },
    {
      title: 'You Don’t Know JS',
      author: 'Kyle Simpson',
      price: 24.99,
      stock: 5
    },
    {
      title: 'JavaScript: The Definitive Guide',
      author: 'David Flanagan',
      price: 49.99,
      stock: 8
    },
    {
      title: 'Learning JavaScript Design Patterns',
      author: 'Addy Osmani',
      price: 34.99,
      stock: 12
    },
    {
      title: 'Effective JavaScript',
      author: 'David Herman',
      price: 39.99,
      stock: 7
    },
    {
      title: 'JavaScript and JQuery: Interactive Front-End Web Development',
      author: 'Jon Duckett',
      price: 45.99,
      stock: 11
    },
    {
      title: 'Programming JavaScript Applications',
      author: 'Eric Elliott',
      price: 29.99,
      stock: 6
    },
    {
      title: 'Secrets of the JavaScript Ninja',
      author: 'John Resig and Bear Bibeault',
      price: 39.99,
      stock: 9
    },
    {
      title: 'JavaScript: The Good Parts',
      author: 'Douglas Crockford',
      price: 29.99,
      stock: 10
    }
  ];
  
// Add sample data to the database
const seedDatabase = async () => {
  try {
    await Book.deleteMany({}); // Clear existing data
    await Book.insertMany(sampleBooks); // Insert sample data
    console.log('Sample data inserted');
    mongoose.connection.close();
  } catch (error) {
    console.error(error);
  }
};

seedDatabase();
