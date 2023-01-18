import { Right } from '../../../../utils/types';
import { ICocktailExternalDatasource } from '../../datasources/external-datasource/types';
import { IInternalCocktailDatasource } from '../../datasources/internal-datasource/types';
import Cocktail from '../../models/cocktail';
import { getCocktailsQuery } from '../../models/get-cocktails';
import { IGetCocktailsUsecase } from './types';

export default class GetCocktailsUsecase implements IGetCocktailsUsecase {
  constructor(
    private readonly externalDatasource: ICocktailExternalDatasource,
    private readonly internalDatasource: IInternalCocktailDatasource
  ) {
    this.getDetail = this.getDetail.bind(this);
    this.execute = this.execute.bind(this);
    this.saveCocktails = this.saveCocktails.bind(this);
  }

  async saveCocktails(cocktails: Cocktail[]) {
    for (const cocktail of cocktails) {
      await this.internalDatasource.saveOne(cocktail);
    }
  }

  async getDetail({ idDrink }: { idDrink: string }) {
    const result = await this.externalDatasource.getCocktailDetail(idDrink);
    return result.isError ? null : result.success;
  }

  async execute(query: getCocktailsQuery) {
    const listResult = await this.externalDatasource.getCocktailsList(query);
    if (listResult.isError) return listResult;

    const rawCocktails = await Promise.all(listResult.success.map(this.getDetail));
    const cocktails = rawCocktails.filter(Boolean) as Cocktail[];
    void this.saveCocktails(cocktails);

    return new Right(cocktails);
  }
}
