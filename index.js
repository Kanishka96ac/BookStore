require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const booksRouter = require('./src/routes/books');
const ordersRouter = require('./src/routes/orders');
const usersRouter = require('./src/routes/users');

const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(mongoURI);
const db = mongoose.connection;

db.on('error', (error) => console.error(error));
db.once('open', () => {
  console.log('Connected to Database');
  console.log('You can access the application');
});

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/books', booksRouter);
app.use('/orders', ordersRouter);
app.use('/users', usersRouter);

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
};

app.use(errorHandler);

// Start the server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app; // Export the app instance