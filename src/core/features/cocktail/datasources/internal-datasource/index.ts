import DatabaseService from '../../../../utils/services/database-service';
import createLoggerService from '../../../../utils/services/logger';
import Cocktail from '../../models/cocktail';
import Ingredient from '../../models/ingredient';
import Measure from '../../models/measure';
import InternalCocktailDatasource from './internal-datasource';
import { IInternalCocktailDatasource } from './types';

let instance: IInternalCocktailDatasource;

const createInternalCocktailDatasource = (): IInternalCocktailDatasource => {
  if (!instance) {
    instance = new InternalCocktailDatasource(
      DatabaseService.getRepository(Cocktail),
      DatabaseService.getRepository(Measure),
      DatabaseService.getRepository(Ingredient),
      createLoggerService()
    );
  }
  return instance;
}

export default createInternalCocktailDatasource;
