const {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
} = require('./handler');

const url = '/books';

const routes = [
  {
    method: 'POST',
    path: url,
    handler: addBookHandler,
  },
  {
    method: 'GET',
    path: url,
    handler: getAllBooksHandler,
  },
  {
    method: 'GET',
    path: `${url}/{id}`,
    handler: getBookByIdHandler,
  },
  {
    method: 'PUT',
    path: `${url}/{id}`,
    handler: editBookByIdHandler,
  },
  {
    method: 'DELETE',
    path: `${url}/{id}`,
    handler: deleteBookByIdHandler,
  },
];

module.exports = routes;
