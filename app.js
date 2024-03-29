/******************************************************************************
 *	ITE5315 – Assignment 4
 *	I declare that this assignment is my own work in accordance with Humber Academic Policy.   *  No part of this assignment has been copied manually or electronically from any other source *  (including web sites) or distributed to other students.
 *
 *	Name: __Jatin Kumar__ Student ID: __N01552458__ Date: _28/03/2024__
 *
 *
 ******************************************************************************/
// Require necessary modules

var express  = require('express');
var mongoose = require('mongoose');
var app      = express();
var database = require('./config/database');
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
var path = require("path");
const exphbs = require("express-handlebars");

var port     = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(express.static(path.join(__dirname, "public")));


mongoose.connect(database.url);

var books = require('./models/books');

app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",
    helpers: {
      modifyAvg: function (avg_reviews) {
        return avg_reviews !== "" ? avg_reviews : "N/A";
      },
    },
  })
);

// Home route
app.set("view engine", "hbs");
 
 
//get all books data from db
app.get('/api/books-info', async (req, res) => {
    try {
      const book = await books.find().lean();
      res.render("allData", { jsonData: book });
      // res.json(book);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/books', async (req, res) => {
    try {
      const book = await books.find().lean();
      // res.render("allData", { jsonData: books });
      res.json(book);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  

// get an employee with the specified ID
app.get('/api/books/:books_id', async (req, res) => {
    try {
      const id = req.params.books_id;
      const book = await books.findById(id);
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }
      res.json(book);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


  app.post('/api/books', async (req, res) => {
    try {
        const book = await books.create({
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            priceIncludingUsedBooks: req.body.priceIncludingUsedBooks,
            pages: req.body.pages,
            avgReviews: req.body.avgReviews,
            nReviews: req.body.nReviews,
            star: req.body.star,
            dimensions: req.body.dimensions,
            weight: req.body.weight,
            language: req.body.language,
            publisher: req.body.publisher,
            ISBN13: req.body.ISBN13,
            completeLink: req.body.completeLink
        });
        const allBooks = await books.find();
        res.render("allData", { jsonData: book });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/addbooks', async (req, res) => {
  res.render("addbook");

});


app.put('/api/books/:book_id', async (req, res) => {
  const id = req.params.book_id;
  try {
      const data = {
          title: req.body.title,
          author: req.body.author,
          price: req.body.price,
          priceIncludingUsedBooks: req.body.priceIncludingUsedBooks,
          pages: req.body.pages,
          avgReviews: req.body.avgReviews,
          nReviews: req.body.nReviews,
          star: req.body.star,
          dimensions: req.body.dimensions,
          weight: req.body.weight,
          language: req.body.language,
          publisher: req.body.publisher,
          ISBN13: req.body.ISBN13,
          completeLink: req.body.completeLink
      };

      const book = await books.findByIdAndUpdate(id, data);
      if (!book) {
          return res.status(404).json({ error: 'Book not found' });
      }

      const updatedBook = await books.findById(id);
      res.send(`Successfully! Book updated - ${updatedBook.title}`);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

  
app.delete('/api/books/:books_id', async (req, res) => {
    try {
      const id = req.params.books_id;
      const deletedbooks = await books.findByIdAndDelete(id);
      if (!deletedbooks) {
        return res.status(404).json({ error: 'book not found' });
      }
      res.send('Successfully! book has been Deleted.');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

app.listen(port);
console.log("App listening on port : " + port);