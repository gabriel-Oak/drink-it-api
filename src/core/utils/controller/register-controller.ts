import {
  NextFunction, Request, Response, Router
} from 'express';
import { FastifyInstance } from 'fastify';
import HttpError from '../errors/http-error';
import createLoggerService from '../services/logger';
import { SYMBOL_GET, SYMBOL_POST } from './decorators/symbols';
import { controllerAction, controllerActionFastify, IControllerActionMeta } from './types';

export function registerControllerDEPRECATED(
  path: string,
  controller: object,
  router: Router
) {
  const rt = Router();

  function processMeta(symbol: symbol, method: 'get' | 'post') {
    if (Reflect.hasMetadata(symbol, controller.constructor)) {
      const actions = Reflect.getMetadata(
        symbol,
        controller.constructor
      ) as IControllerActionMeta[];

      actions.forEach(({ path: p, action }) => {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        rt[method](p, async (req: Request, res: Response, next: NextFunction) => {
          try {
            await (controller as Record<string, controllerAction>)[action](req, res);
          } catch (error) {
            next(error);
          }
        });
      });
    }
  }

  processMeta(SYMBOL_GET, 'get');
  processMeta(SYMBOL_POST, 'post');

  router.use(path, rt);
}

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

      actions.forEach(({ path: p, action }) => {
        const actionPath = p === '/' ? '' : p
        app[method](`${path}${actionPath}`, async (req, rep) => {
          try {
            const res = await (controller as Record<string, controllerActionFastify>)[action](req, rep);
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
