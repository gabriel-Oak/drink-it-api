import { COCKTAIL_API } from '../../../../utils/constants';
import { IHttpService } from '../../../../utils/services/http-service/types';
import { ILoggerService } from '../../../../utils/services/logger/types';
import { Either, Left, Right } from '../../../../utils/types';
import Cocktail from '../../models/cocktail';
import { GetCocktailDetailsResponse, GetCocktailsListResponse, getCocktailsQuery } from '../../models/get-cocktails';
import { CocktailDatasourceError, ICocktailExternalDatasource } from './types';

export default class CocktailExternalDatasource implements ICocktailExternalDatasource {
  constructor(
    private readonly httpService: IHttpService,
    private readonly logger: ILoggerService
  ) { }

  async getCocktailsList(query: getCocktailsQuery) {
    try {
      const result = await this.httpService.get<GetCocktailsListResponse>(`${COCKTAIL_API}/filter.php`, {
        params: query
      });

      return new Right(result.drinks);
    } catch (e) {
      const error = new CocktailDatasourceError(
        'Something went wrong consulting cocktails service',
        { error: e, query }
      );
      this.logger.error(error.message, error);
      return new Left(error);
    }
  }

  async getCocktailDetail(cocktailId: string): Promise<Either<CocktailDatasourceError, Cocktail>> {
    try {
      const result = await this.httpService.get<GetCocktailDetailsResponse>(`${COCKTAIL_API}/lookup.php`, {
        params: { i: cocktailId }
      });

      if (!result.drinks?.length) {
        return new Left(new CocktailDatasourceError(`Couldn't find any drinks for this id ${cocktailId}`));
      }

      return new Right(Cocktail.fromSource(result.drinks[0]));
    } catch (e) {
      const error = new CocktailDatasourceError(
        'Something wen wrong consulting cocktails service',
        { error: e, cocktailId }
      );
      this.logger.error(error.message, error);
      return new Left(error);
    }
  }
}
