import { Right } from '../../../../utils/types';
import { ICocktailExternalDatasource } from '../../datasources/external-datasource/types';
import Cocktail from '../../models/cocktail';
import { getCocktailsQuery } from '../../models/get-cocktails';
import { IGetCocktailsUsecase } from './types';

export default class GetCocktailsUsecase implements IGetCocktailsUsecase {
  constructor(private readonly cocktailExternalDatasource: ICocktailExternalDatasource) {
    this.getDetail = this.getDetail.bind(this);
    this.execute = this.execute.bind(this);
  }

  async getDetail({ idDrink }: { idDrink: string }) {
    const result = await this.cocktailExternalDatasource.getCocktailDetail(idDrink);
    return result.isError ? null : result.success;
  }

  async execute(query: getCocktailsQuery) {
    const listResult = await this.cocktailExternalDatasource.getCocktailsList(query);
    if (listResult.isError) return listResult;

    const cocktails = await Promise.all(listResult.success.map(this.getDetail));

    return new Right(cocktails.filter(Boolean) as Cocktail[]);
  }
}
