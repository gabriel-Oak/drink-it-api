import { FastifyInstance } from 'fastify';
import User from '../../features/users/models/user';
import createDecodeUserTokenUsecase from '../../features/users/usecases/decode-user-token';
import { decodeUserTokenErrors } from '../../features/users/usecases/decode-user-token/types';
import HttpError from '../errors/http-error';
import createLoggerService from '../services/logger';
import { Either } from '../types';
import { SYMBOL_GET, SYMBOL_POST, SYMBOL_PRIVATE } from './decorators/symbols';
import { controllerAction, IControllerActionMeta } from './types';

export default function registerController(
  path: string,
  controller: object,
  app: FastifyInstance
) {
  function processMeta(symbol: symbol, method: 'get' | 'post') {
    if (Reflect.hasMetadata(symbol, controller.constructor)) {
      const actions = Reflect.getMetadata(
        symbol,
        controller.constructor
      ) as IControllerActionMeta[];
      const privateRoutes = Reflect.getMetadata(
        SYMBOL_PRIVATE,
        controller.constructor
      ) as string[];

      actions.forEach(({ path: p, action }) => {
        const actionPath = p === '/' ? '' : p
        app[method](`${path}${actionPath}`, async (req, rep) => {
          try {
            let user: User;
            if (privateRoutes.includes(action)) {
              const decoder = createDecodeUserTokenUsecase();
              const { auth } = req.headers;
              const decodeResult: Either<decodeUserTokenErrors, User> = await decoder.execute(String(auth));

              if (decodeResult.isError) {
                const error = new HttpError({
                  message: 'Sorry, you need to specify a valid "auth" header token.',
                  meta: decodeResult.error,
                  statusCode: 403
                });
                return await rep.code(error.statusCode).send(error);
              }

              user = decodeResult.success;
            }

            const res = await (controller as Record<string, controllerAction>)[action](req, rep, user!);
            return res;
          } catch (e) {
            const error = new HttpError({
              message: (e as any).message,
              meta: e
            });

            const logger = createLoggerService();
            logger.error(error.message, error);
            await rep.code(error.statusCode).send(error);
          }
        });
      });
    }
  }

  processMeta(SYMBOL_GET, 'get');
  processMeta(SYMBOL_POST, 'post');
}
