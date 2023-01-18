import BaseError from '../../../../utils/errors/base-error';
import { Either } from '../../../../utils/types';
import Cocktail from '../../models/cocktail';
import { cocktailList, getCocktailsQuery } from '../../models/get-cocktails';

export class CocktailDatasourceError extends BaseError {
  public readonly type = 'coktail-datasource';
}

export interface ICocktailExternalDatasource {
  getCocktailsList: (
    query: getCocktailsQuery
  ) => Promise<Either<CocktailDatasourceError, cocktailList>>;
  getCocktailDetail: (
    cocktailId: string
  ) => Promise<Either<CocktailDatasourceError, Cocktail | null>>;
}
