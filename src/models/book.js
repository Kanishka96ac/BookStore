const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true }
});

// Add indexes
bookSchema.index({ title: 1 });
bookSchema.index({ author: 1 });
bookSchema.index({ price: 1 });

// Instance method to display book details
bookSchema.methods.displayDetails = function() {
  console.log(`${this.title} by ${this.author}`);
};

// Static method to find books by author
bookSchema.statics.findByAuthor = function(author) {
  return this.find({ author: author });
};


const Book = mongoose.model('Book', bookSchema);

module.exports = Book;