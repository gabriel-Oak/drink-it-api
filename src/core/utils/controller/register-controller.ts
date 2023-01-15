import {
  NextFunction, Request, Response, Router
} from 'express';
import { SYMBOL_GET, SYMBOL_POST } from './decorators/symbols';
import { controllerAction, IControllerActionMeta } from './types';

export default function registerController(
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
