const express = require('express');
const session = require('express-session')
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
      return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
// Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}



//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  // Check if username or password is missing
  if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
  }
  // Authenticate user
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
        data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
        accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.authorization.username;
    let book = books[isbn];
    
    if (books[isbn]){
        book.reviews[username] = review;
        // Send success message indicating the review has been updated
        res.send(`The review for the book with ISBN ${isbn} has been added/updated.`);
    } else {
        // Send error message if no isbn is found
        res.send({message: `ISBN ${isbn} not found.`});
    }
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (books[isbn]) {
      let book = books[isbn];
      delete book.reviews[username];
      return res.status(200).send(`Review for the book with ${isbn} successfully deleted`);
  }
  else {

      return res.status(404).json({message: `ISBN ${isbn} not found`});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
