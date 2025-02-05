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
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
