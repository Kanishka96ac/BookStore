const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Book'  // Reference to the Book model
    },
    quantity: {
      type: Number,
      required: true  // Number of copies ordered
    },
    totalPrice: {
      type: Number,
      required: true  // Total price of the order
    },
    orderDate: {
      type: Date,
      default: Date.now  // Date when the order was placed
    }
  });

// Create the Order model from the schema
const Order = mongoose.model('Order', orderSchema);

// Export the model to use it in other parts of the application
module.exports = Order;