import express, {
  ErrorRequestHandler, NextFunction, Request, Response
} from 'express';
import HttpError from '../core/utils/errors/http-error';
import createLoggerService from '../core/utils/services/logger';
import router from './routes';

const app = express();

app.use(express.json());
app.use(router);
app.use((error: ErrorRequestHandler, _req: Request, res: Response, _: NextFunction) => {
  const httpError = new HttpError({
    message: 'Comportamento inesperado:',
    meta: String(error)
  });

  const logger = createLoggerService();
  logger.error(httpError.message, error);
  res.status(httpError.statusCode).json(httpError);
});

export default app;
