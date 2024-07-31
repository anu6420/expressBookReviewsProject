const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
// Register a new user
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!isValid(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          console.log(users)
          return res.status(200).json({message: "User successfully registered. Now you can login"});
          res.redirect('/login');
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});

});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  res.send(JSON.stringify(books));

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);

 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  const author = req.params.author;
  const valuesInList = await Object.values(books);

  const booksByAuthor = await valuesInList.filter(book => book.author.trim() == author.trim());
  res.send(booksByAuthor);
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  const title = req.params.title;
  const booksInList = await Object.values(books);

  const booksByTitle = await booksInList.filter(book => book.title.trim() == title.trim());
  res.send(booksByTitle);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
    if (book){
        res.send(book.reviews);
    }
    else{
        res.send("Not found")
    }
});

module.exports.general = public_users;
