import 'reflect-metadata';
import './express-DEPRECATED/config';
import startServerFastify from './fastify/server';
// import startServer from './express-DEPRECATED/server'

// startServer();
startServerFastify()
  .catch(console.error);
