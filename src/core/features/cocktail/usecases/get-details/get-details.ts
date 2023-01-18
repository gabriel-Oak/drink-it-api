import { Left, Right } from '../../../../utils/types';
import { ICocktailExternalDatasource } from '../../datasources/external-datasource/types';
import { IInternalCocktailDatasource } from '../../datasources/internal-datasource/types';
import Cocktail from '../../models/cocktail';
import { DetailsNotFoundError, IGetDetailsUsecase } from './type';

export default class GetDetailsUsecase implements IGetDetailsUsecase {
  constructor(
    private readonly externalDatasource: ICocktailExternalDatasource,
    private readonly internalDatasource: IInternalCocktailDatasource
  ) {}

  async execute(cocktailId: string, save?: boolean) {
    const internalCocktail = await this.internalDatasource.findOne(cocktailId);
    if (!internalCocktail.isError && internalCocktail.success) {
      return internalCocktail as Right<Cocktail>;
    }

    const externalCocktail = await this.externalDatasource.getCocktailDetail(cocktailId);
    if (!externalCocktail.isError && externalCocktail.success) {
      if (save) void this.internalDatasource.saveOne(externalCocktail.success);
      return externalCocktail as Right<Cocktail>;
    }

    return new Left(new DetailsNotFoundError());
  }
}
