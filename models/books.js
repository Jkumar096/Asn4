const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: String,
    author: String,
    price: Number,
    priceIncludingUsedBooks: Number,
    pages: Number,
    avgReviews: Number,
    nReviews: Number,
    star: String,
    dimensions: String,
    weight: String,
    language: String,
    publisher: String,
    ISBN13: String,
    completeLink: String
});

const Data = mongoose.model('books', bookSchema);

module.exports = Data;
