import createCocktailExternalDatasource from '../../datasources/external-datasource';
import GetCocktailsUsecase from './get-cocktails-usecase';
import { IGetCocktailsUsecase } from './types';

const createGetCocktailsUsecase = (): IGetCocktailsUsecase => new GetCocktailsUsecase(
  createCocktailExternalDatasource()
);

export default createGetCocktailsUsecase;
