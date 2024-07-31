const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const advancedQuery = require('../middleware/advancedQuery');
const { body, validationResult } = require('express-validator');
const { auth, admin } = require('../middleware/auth');

// Get all books with advanced querying, filtering, sorting, and pagination
router.get('/', advancedQuery(Book), (req, res) => {
  res.json(res.advancedResults);
});

// Get a single book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Create a new book with validation (admin only)
router.post('/',
  auth,
  admin,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('author').not().isEmpty().withMessage('Author is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('stock').isNumeric().withMessage('Stock must be a number'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Proceed with creating a new book
    try {
      const book = new Book(req.body);
      await book.save();
      res.status(201).json(book);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

// Update a book by ID (admin only)
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const { title, author, price, stock } = req.body;
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, price, stock },
      { new: true, runValidators: true }
    );
    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a book by ID (admin only)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
