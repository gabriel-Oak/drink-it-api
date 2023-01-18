import { FastifyInstance } from 'fastify';
import createCocktailController from '../core/features/cocktail/controller';
import buildRoutes from '../core/utils/controller/build-routes';
import HttpError from '../core/utils/errors/http-error';

const createRouter = (app: FastifyInstance) => {
  buildRoutes(app, [
    createCocktailController
  ]);

  app.get('/health', (_, res) => res.code(200).send({ status: 'ok' }));
  app.get('/*', (req, res) => res.code(404).send(new HttpError({
    message: 'Erro, parece que a rota que você está procurando não existe ou foi removida',
    statusCode: 404,
    meta: req.url
  })));
}

export default createRouter;
