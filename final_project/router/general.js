const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(400).json({message:'username and password are required'});
  }

  const userExist = users.some(user => user.username === username);

  if(userExist){
    return res.status(409).json({message:'user already exixst'});
  }

  users.push({"username":username , "password":password});
  return res.status(200).json({message :'user created.now you can login'});
});

// Task 1 & Task 10: Get the book list available in the shop
public_users.get('/', function (req, res) {
  const getBooks = new Promise((resolve, reject) => {
    resolve(books);
  });

  getBooks.then((b) => {
    return res.status(200).send(JSON.stringify(b, null, 4));
  }).catch((err) => {
    return res.status(500).json({message: "Error fetching books"});
  });
});

// Task 2 & Task 11: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const getBook = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({ status: 404, message: "Book not found" });
    }
  });

  getBook.then((book) => {
    return res.status(200).send(JSON.stringify(book, null, 4));
  }).catch((err) => {
    return res.status(err.status).json({ message: err.message });
  });
});

// Task 3 & Task 12: Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const getBooksByAuthor = new Promise((resolve, reject) => {
    const bookKeys = Object.keys(books);
    let matchingBooks = [];

    bookKeys.forEach(key => {
      if (books[key].author === author) {
        matchingBooks.push(books[key]);
      }
    });

    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject({ status: 404, message: "No books found by this author" });
    }
  });

  getBooksByAuthor.then((matching) => {
    return res.status(200).send(JSON.stringify(matching, null, 4));
  }).catch((err) => {
    return res.status(err.status).json({ message: err.message });
  });
});

// Task 4 & Task 13: Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const getBooksByTitle = new Promise((resolve, reject) => {
    const bookKeys = Object.keys(books);
    let matchingBooks = [];

    bookKeys.forEach(key => {
      if (books[key].title === title) {
        matchingBooks.push(books[key]);
      }
    });

    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject({ status: 404, message: "No books found with this title" });
    }
  });

  getBooksByTitle.then((matching) => {
    return res.status(200).send(JSON.stringify(matching, null, 4));
  }).catch((err) => {
    return res.status(err.status).json({ message: err.message });
  });
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if(books[isbn]){
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({message :'book not found'});
  }
});

module.exports.general = public_users;
