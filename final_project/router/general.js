const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    let username = req.body.username;
    let password = req.body.password;

    console.log(req.body)

    if(!username || !password)
    {
        return res.send("Missing credentials");
    }

    if(isValid(username))
    {
        users.push({"username": username, "password": password})
        return res.send("You are now registered, you may loggin to your account")
    }
    

    res.send("Username already taken");
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  res.send(JSON.stringify(books[req.params.isbn], null, 4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let books_found = {};
  let target_author = req.params.author;
  let dict_keys = Object.keys(books);
  for(let i in dict_keys)
  {
    let ISBN = dict_keys[i];
    let author = books[ISBN].author;
    if(author == target_author)
    {
        books_found[ISBN] = books[ISBN];
    }
  }

  res.send(JSON.stringify(books_found, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let books_found = {};
  let target_title = req.params.title;
  let dict_keys = Object.keys(books);
  for(let i in dict_keys)
  {
    let ISBN = dict_keys[i];
    let title = books[ISBN].title;
    if(title == target_title)
    {
        books_found[ISBN] = books[ISBN];
    }
  }
  
    res.send(JSON.stringify(books_found, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let book = books[req.params.isbn]
  if(book)
  {
    return res.send(JSON.stringify(book.reviews, null, 4))
  }
  return res.status(404).json({message: "Book not found."});
});

module.exports.general = public_users;
