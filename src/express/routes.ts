import { Router } from 'express';
import createCocktailController from '../core/features/cocktail/controller';
import buildRoutes from '../core/utils/controller/build-routes';
import HttpError from '../core/utils/errors/http-error';

const router = Router();

buildRoutes(router, [
  createCocktailController
]);

router.get('/health', (_, res) => res.status(200).json({ status: 'ok' }));
router.get('/**', (req, res) => res.status(404).json(new HttpError({
  message: 'Erro, parece que a rota que você está procurando não existe ou foi removida',
  statusCode: 404,
  meta: req.url
})));

export default router;
