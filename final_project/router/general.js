const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    let username = req.body.username;
    let password = req.body.password;

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
function getAllBooks()
{
  setTimeout(() => {console.log("1s delay complete")}, 1000); // Simulated a delay
  return books;
}

public_users.get('/', async function (req, res) {
  let books_ = await getAllBooks();
  res.send(JSON.stringify(books_, null, 4));
});

// Get book details based on ISBN
function getBookByISBN(isbn)
{
  setTimeout(() => {console.log("1s delay complete")}, 1000); // Simulate a delay
  return books[isbn]
}
public_users.get('/isbn/:isbn',async function (req, res) {
  let book = await getBookByISBN(req.params.isbn);
  res.send(JSON.stringify(book, null, 4));
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
