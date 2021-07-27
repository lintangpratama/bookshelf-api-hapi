/* eslint-disable semi */

// Import the required modules
const books = require('./books');
const { nanoid } = require('nanoid');

// Handler to add new book
const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  // Create the necessary book properties/information
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = readPage === pageCount;

  // Create the new object to contain the books information
  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
  }

  // Condition if name property wasn't added, return fail
  if (name === '' || name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400);
    return response;
  }

  // Condition if number of page readed is bigger than number of book page, return fail
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    });
    response.code(400);
    return response;
  }

  // Condition if the book has the necessary property
  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    });
    response.code(201);
    return response;
  }

  // Condition if there are a regular error in the program, deleted the last book that have been pushed. Return error
  books.pop()
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan'
  });
  response.code(500);
  return response;
}

// Handler to get all the book information
const getAllBookHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  let responseBook = books;

  // Condition if there are a name query have been given.
  if (name) {
    const nameSearch = name.toLowerCase();
    responseBook = books.filter((book) => (book.name).toLowerCase().includes(nameSearch));
  }

  // Condition if there are a reading query have been given
  if (reading) {
    responseBook = books.filter((book) => Number(book.reading) === Number(reading));
  }

  // Condition if there are a finished query have been given
  if (finished) {
    responseBook = books.filter((book) => Number(book.finished) === Number(finished));
  }

  // Send the response of the client request
  const response = h.response({
    status: 'success',
    data: {
      books: responseBook.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      }))
    }
  });
  response.code(200);
  return response;
}

// Handler to get the specified book by the id
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  // Checking the id of the book is there any or not
  const book = books.filter((b) => b.id === bookId)[0];

  // Response if there is a book that means has been founded
  if (book !== undefined) {
    const response = h.response({
      status: 'success',
      data: {
        book
      }
    });
    response.code(200);
    return response;
  }

  // Response if the book isn't founded
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  });
  response.code(404);
  return response;
}

// Handler to edit the book information
const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage;

  // Search the index of the book, return the index of the book or -1
  const index = books.findIndex((book) => book.id === bookId);

  // Condition if the book isn't founded
  if (index === -1) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    });
    response.code(404);
    return response;
  }

  // Condition if the name of the book isn't given
  if (name === '' || name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    });
    response.code(400);
    return response;
  }

  // Condition if the number of the page readed is bigger than the number of book page
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    });
    response.code(400);
    return response;
  }

  // Condition if the book is founded and have a complete property
  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    updatedAt
  }

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui'
  });
  response.code(200);
  return response;
}

// Handler to delete the book by the id
const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  // Search the index of the book by the id
  const index = books.findIndex((book) => book.id === bookId);

  // Condition if the book have been founded
  if (index !== -1) {
    books.splice(index, 1);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    });
    response.code(200);
    return response;
  }

  // Condition if the book isn't founded
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
  response.code(404);
  return response;
}

module.exports = { addBookHandler, getAllBookHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler }
