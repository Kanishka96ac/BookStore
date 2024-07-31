const mongoose = require('mongoose');
const Book = require('./models/book');
const Order = require('./models/order');

const mongoURI = 'mongodb+srv://kanishka:bookstore%23@bookstore-online.ssex6eh.mongodb.net/?retryWrites=true&w=majority&appName=bookstore-online';

mongoose.connect(mongoURI);

const db = mongoose.connection;

db.on('error', (err) => console.log(err));
db.once('open', () => console.log('Connected to the Database'));

const sampleOrders = [
    
  ];

// Add sample data to the database
const seedDatabase = async () => {
    try {
      await Order.deleteMany({}); // Clear existing data
      await Order.insertMany(sampleOrders); // Insert sample data
      console.log('Sample Order data inserted');
      mongoose.connection.close();
    } catch (error) {
      console.error(error);
    }
  };
  
seedDatabase();


