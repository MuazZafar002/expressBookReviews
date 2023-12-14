const express = require('express');
const books = require('./booksdb.js');
const isValid = require('./auth_users.js').isValid;
const users = require('./auth_users.js').users;
const axios = require('axios');

const public_users = express.Router();

public_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  if (!isValid(username)) {
    users.push({ 'username': username, 'password': password });
    return res.status(200).json({ message: 'User successfully registered' });
  } else {
    return res.status(400).json({ message: 'Username already exists' });
  }
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
  const getBooks = new Promise(resolve => resolve(res.status(200).json(books)));
  getBooks.then(() => console.log('Promise for Task 10 resolved'));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const getBook = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;

    if (books[isbn]) {
      resolve(res.status(200).json(books[isbn]));
    } else {
      reject(res.status(404).json({ message: `The book is not found by ISBN: ${isbn}` }));
    }
  });
  getBook
    .then(() => console.log('Promise for Task 11 resolved'))
    .catch(() => console.log('Promise for Task 11 rejected'));
});

// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  const getBooks = new Promise((resolve, reject) => {
    const author = req.params.author;
    const booksOfAuthor = Object.values(books).filter(book => book.author === author);

    if (booksOfAuthor.length > 0) {
      resolve(res.status(200).json(booksOfAuthor));
    } else {
      reject(res.status(404).json({ message: `The books are not found by author: ${author}` }));
    }
  });
  getBooks
    .then(() => console.log('Promise for Task 12 resolved'))
    .catch(() => console.log('Promise for Task 12 rejected'));
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  const getBooks = new Promise((resolve, reject) => {
    const title = req.params.title;
    const booksWithTitle = Object.values(books).filter(book => book.title === title);

    if (booksWithTitle.length > 0) {
      resolve(res.status(200).json(booksWithTitle));
    } else {
      reject(res.status(404).json({ message: `The books are not found by title: ${title}` }));
    }
  });
  getBooks
    .then(() => console.log('Promise for Task 13 resolved'))
    .catch(() => console.log('Promise for Task 13 rejected'));
});

//  Get book review
public_users.get('/review/:isbn', (req, res) => {
  return res.status(200).json(books[req.params.isbn].reviews);
});

const getBooksPromiseCallback = () => {
  return new Promise((resolve, reject) => {
    axios.get('/allbook') 
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
};

  const getBooksAsyncAwait = async () => {
    try {
      const response = await axios.get('/allbookasync'); // Replace with your actual endpoint
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  };
  const getBookDetailsPromiseCallback = (isbn) => {
    return new Promise((resolve, reject) => {
      axios.get(`/asyncisbn/:{isbn}`) // Replace with your actual endpoint
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
  const getBooksByAuthorAsyncAwait = async (author) => {
    try {
      const response = await axios.get(`/asyncauthor/:{author}`); // Replace with your actual endpoint
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  };
  const getBooksByTitlePromiseCallback = (title) => {
    return new Promise((resolve, reject) => {
      axios.get(`/asynctitle/:{title}`) // Replace with your actual endpoint
        .then(response => {
          resolve(response.data);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
module.exports.general = public_users;