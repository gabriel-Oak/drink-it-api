import createHttpService from '../../../../utils/services/http-service';
import createLoggerService from '../../../../utils/services/logger';
import CocktailExternalDatasource from './external-datasouce';
import { ICocktailExternalDatasource } from './types';

const createCocktailExternalDatasource = (): ICocktailExternalDatasource => new CocktailExternalDatasource(
  createHttpService(),
  createLoggerService()
);

export default createCocktailExternalDatasource;
