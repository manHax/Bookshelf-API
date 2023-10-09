const Hapi = require('@hapi/hapi');

const http = require('http');
const routes = require('./routes');

function findAvailablePort(startingPort, callback) {
  const server = http.createServer();

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      findAvailablePort(startingPort + 1, callback);
    } else {
      callback(err);
    }
  });

  server.on('listening', () => {
    const { port } = server.address();
    server.close(() => {
      callback(null, port);
    });
  });

  server.listen(startingPort, '0.0.0.0');
}

const init = async () => {
  let availPort ;
  // Contoh penggunaan:
  findAvailablePort(9000, (err, port) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log('Port yang tersedia:', port);
      availPort = port;
    }
  });
  const server = Hapi.server({
    port: availPort,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(routes);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
