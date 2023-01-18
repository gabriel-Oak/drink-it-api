import fastify from 'fastify';
import cors from '@fastify/cors';
import createRouter from './routes';
import DatabaseService from '../core/utils/services/database-service';

const app = fastify();
void app.register(cors);
void DatabaseService.initialize();
createRouter(app);

export default app;
