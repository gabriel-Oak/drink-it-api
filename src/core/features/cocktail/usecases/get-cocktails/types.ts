import { Either } from '../../../../utils/types';
import { CocktailDatasourceError } from '../../datasources/external-datasource/types'
import Cocktail from '../../models/cocktail';
import { getCocktailsQuery } from '../../models/get-cocktails';

type getCocktailsUsecaseErrors = CocktailDatasourceError;

export interface IGetCocktailsUsecase {
  execute: (
    query: getCocktailsQuery
  ) => Promise<Either<getCocktailsUsecaseErrors, Cocktail[]>>
}
