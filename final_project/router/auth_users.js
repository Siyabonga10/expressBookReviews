const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let matching_users = users.filter((user) => 
    {
        return user.username == username;
    })

    return matching_users.length == 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let matching_users = users.filter((user) => 
    {
        return user.username == username && user.password == password;
    })

    return matching_users.length != 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;

  if(!username || !password)
  {
    return res.send("Missing credentials")
  }
  if(authenticatedUser(username, password))
  {
    let token = jwt.sign(
        {user: username, pass: password}, "totallySecureSecretKey", {expiresIn: '1h'}
    )
    req.session.token = token;
    return res.send("You have been logged in.")
  }
  return res.status(200).json({message: "Invalid credentials."});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Find the right book object
  let book = books[req.params.isbn]
  if(!book)
  {
    return res.status(404).send("Book not found");
  }
  let review = req.body.review
  if(!review)
  {
    return res.send("No review provided");
  }

  book.reviews[req.session.user] = review;

  return res.json({message: "Review published succesfully"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
