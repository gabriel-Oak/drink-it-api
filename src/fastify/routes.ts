import { FastifyInstance } from 'fastify';
import createCocktailController from '../core/features/cocktail/controller';
import createUserController from '../core/features/users/controller';
import buildRoutes from '../core/utils/controller/build-routes';
import HttpError from '../core/utils/errors/http-error';

const createRouter = (app: FastifyInstance) => {
  buildRoutes(app, [
    createCocktailController,
    createUserController
  ]);

  app.get('/health', (_, res) => res.code(200).send({ status: 'ok' }));
  app.get('/*', (req, res) => res.code(404).send(new HttpError({
    message: 'Error, looks like the route you are looking for has been removed or doesn\'t exists',
    statusCode: 404,
    meta: req.url
  })));
}

export default createRouter;
