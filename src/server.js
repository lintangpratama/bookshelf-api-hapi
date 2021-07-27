/* eslint-disable semi */

// Import the required modules
const Hapi = require('@hapi/hapi');
const routes = require('./routes');

// Async function to run the server
const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*']
      }
    }
  });

  server.route(routes);

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
}

init();
