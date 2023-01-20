import './fastify/config';
import 'reflect-metadata';
import startServerFastify from './fastify/server';

startServerFastify()
  .catch(console.error);
