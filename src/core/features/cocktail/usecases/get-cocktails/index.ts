import createCocktailExternalDatasource from '../../datasources/external-datasource';
import createInternalCocktailDatasource from '../../datasources/internal-datasource';
import GetCocktailsUsecase from './get-cocktails-usecase';
import { IGetCocktailsUsecase } from './types';

const createGetCocktailsUsecase = (): IGetCocktailsUsecase => new GetCocktailsUsecase(
  createCocktailExternalDatasource(),
  createInternalCocktailDatasource()
);

export default createGetCocktailsUsecase;
