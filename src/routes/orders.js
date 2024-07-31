// Import necessary modules
const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Book = require('../models/book');

// Route to place a new order

router.get('/', async (req, res) => {
  try{
    const orders = await Order.find();
    res.json(orders);
  }catch(err){
    res.status(500).json({message : err.message});
  }
});

router.get('/:id', async (req, res) => {
  try{
    const order = await Order.findById(req.params.id);
    res.json(order);
  } catch(err){
    res.status(500).json({message : err.message});
  }
});

router.post('/', async (req, res) => {
    const { bookId, quantity } = req.body;  // Destructure bookId and quantity from the request body
    try {
      const book = await Book.findById(bookId);  // Find the book by ID
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });  // Handle book not found
      }
  
      const totalPrice = book.price * quantity;  // Calculate the total price
      const order = new Order({
        bookId,
        quantity,
        totalPrice
      });
  
      const newOrder = await order.save();  // Save the new order to the database
      book.stock -= quantity;  // Decrease the book stock by the ordered quantity
      await book.save();  // Save the updated book to the database
  
      res.status(201).json(newOrder);  // Send the newly created order as a JSON response
    } catch (err) {
      res.status(400).json({ message: err.message });  // Handle any errors
    }
});

// Update an order by ID
router.put('/:id', async (req, res) => {
  try {
    // Extract the quantity from the request body
    const { quantity } = req.body;

    // Find the order by ID
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Calculate the difference in quantity
    const quantityDifference = quantity - order.quantity;

    // Find the associated book by ID
    const book = await Book.findById(order.bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if there's enough stock to fulfill the new order quantity
    if (book.stock < quantityDifference) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    // Update the book's stock
    book.stock -= quantityDifference;
    const updatedBook = await book.save();

    // Update the order's quantity and total price
    order.quantity = quantity;
    order.totalPrice = book.price * quantity;
    const updatedOrder = await order.save();

    // Send the updated order and a message about the book stock update as a JSON response
    res.json([updatedOrder, { message: `Book Stock Updated from ${book.stock + quantityDifference} to ${updatedBook.stock}` }]);

  } catch (err) {
    // Handle any errors that occur
    res.status(400).json({ message: err.message });
  }
});


// Delete an order by ID
router.delete('/:id', async (req, res) => {
  try {
    // Find the order by ID
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Find the book associated with the order
    const book = await Book.findById(order.bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Restore the stock for the book
    book.stock += order.quantity;
    await book.save();

    // Delete the order
    await order.remove();

    // Send a success response
    res.json({ message: 'Order deleted and book stock updated' });
  } catch (err) {
    // Handle any errors
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
