import BaseError from '../../../../utils/errors/base-error';
import { Either } from '../../../../utils/types';
import { CocktailDatasourceError } from '../../datasources/external-datasource/types';
import { InternalCocktailDatasourceError } from '../../datasources/internal-datasource/types';
import Cocktail from '../../models/cocktail';

export class DetailsNotFoundError extends BaseError {
  public readonly type = 'datail-not-found';

  constructor() {
    super('Sorry, couldn\'t find you cocktail');
  }
}

export type getDetailsErrors = InternalCocktailDatasourceError
| CocktailDatasourceError
| DetailsNotFoundError;

export interface IGetDetailsUsecase {
  execute: (cocktailId: string, save?: boolean) => Promise<Either<getDetailsErrors, Cocktail>>;
}