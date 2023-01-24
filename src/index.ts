import './fastify/config';
import 'reflect-metadata';
import startServer from './fastify/server';
import createLoggerService from './core/utils/services/logger';

const logger = createLoggerService();
startServer()
  .catch((error) => logger.error(error.message ?? error, error));
