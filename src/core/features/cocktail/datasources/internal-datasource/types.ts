import BaseError from '../../../../utils/errors/base-error';
import { Either } from '../../../../utils/types';
import Cocktail from '../../models/cocktail';

export class InternalCocktailDatasourceError extends BaseError {
  public readonly type = 'internal-cocktail-datasource';
}

export interface IInternalCocktailDatasource {
  saveOne: (cocktails: Cocktail) => Promise<Either<InternalCocktailDatasourceError, null>>;
  findOne: (cocktailId: string) => Promise<Either<InternalCocktailDatasourceError, Cocktail | null>>;
}
