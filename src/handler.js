const { nanoid } = require('nanoid');
const books = require('./books');
const logger = require('./logger');

// const booksToView = [];
// books.forEach((item) => {
//   if (item.id && item.name && item.publisher) {
//     booksToView.push({ id: item.id, name: item.name, publisher: item.publisher });
//   }
// });

const getAllBooksHandler = (request, h) => {
  let bookToResponse = books;
  const { reading } = request.query;
  const { finished } = request.query;
  const { name } = request.query;

  if (reading === '0') {
    bookToResponse = books.filter((item) => (item.reading === false));
  } if (finished === '0') {
    bookToResponse = books.filter((item) => (item.finished === false));
  } if (reading === '1') {
    bookToResponse = books.filter((item) => (item.reading === true));
  } if (finished === '1') {
    bookToResponse = books.filter((item) => (item.finished === true));
  } if (name !== undefined) {
    bookToResponse = books.filter((item) => (item.name.toLowerCase().includes(name.toLowerCase())));
  }

  bookToResponse = bookToResponse.map((item) => (
    { id: item.id, name: item.name, publisher: item.publisher }));
  const response = h.response({
    status: 'success',
    data:
  { books: bookToResponse },
  });

  return response;
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((n) => n.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};
/*
{
    "id": "Qbax5Oy7L8WKf74l",
    "name": "Buku A",
    "year": 2010,
    "author": "John Doe",
    "summary": "Lorem ipsum dolor sit amet",
    "publisher": "Dicoding Indonesia",
    "pageCount": 100,
    "readPage": 25,
    "finished": false,
    "reading": false,
    "insertedAt": "2021-03-04T09:11:44.598Z",
    "updatedAt": "2021-03-04T09:11:44.598Z"
}
*/
const addBookHandler = (request, h) => {
  logger.info(`Permintaan masuk: ${request.method} ${request.path}`);
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const finished = pageCount === readPage;
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    id,
    insertedAt,
    updatedAt,
  };

  const isReadPageValid = pageCount >= readPage;
  const isBookNameValid = name != null;
  console.log(`${pageCount} ${readPage}`);
  console.log(`${isReadPageValid} ${isBookNameValid}`);

  if (isBookNameValid && isReadPageValid) {
    books.push(newBook);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  } if (!isBookNameValid) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } if (!isReadPageValid) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage;
  const index = books.findIndex((book) => book.id === id);

  const isReadPageValid = pageCount >= readPage;
  const isBookNameValid = name != null;

  if (index !== -1 && isBookNameValid && isReadPageValid) {
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
      id,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  } if (!isBookNameValid) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } if (!isReadPageValid) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
