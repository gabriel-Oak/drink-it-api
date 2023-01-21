import { ICacheService } from '../../../../utils/services/cache-service/types';
import { Right } from '../../../../utils/types';
import { ICocktailExternalDatasource } from '../../datasources/external-datasource/types';
import { IInternalCocktailDatasource } from '../../datasources/internal-datasource/types';
import Cocktail from '../../models/cocktail';
import { cocktailList, getCocktailsQuery } from '../../models/get-cocktails';
import { cocktailMap, IGetCocktailsUsecase } from './types';

export default class GetCocktailsUsecase implements IGetCocktailsUsecase {
  constructor(
    private readonly externalDatasource: ICocktailExternalDatasource,
    private readonly internalDatasource: IInternalCocktailDatasource,
    private readonly cacheService: ICacheService
  ) {
    this.getDetails = this.getDetails.bind(this);
    this.execute = this.execute.bind(this);
    this.saveCocktails = this.saveCocktails.bind(this);
  }

  async saveCocktails(cocktails: Cocktail[]) {
    for (const cocktail of cocktails) {
      await this.internalDatasource.saveOne(cocktail);
    }
  }

  async getDetails(cocktails: cocktailList) {
    // Get previusly storaged cocktails
    const internalResults = await this.internalDatasource.findMany(cocktails.map((c) => c.idDrink));
    const internalCocktails: cocktailMap = {};
    if (!internalResults.isError) {
      internalResults.success.forEach((cocktail) => internalCocktails[cocktail.id] = cocktail);
    }

    // Get the others from api
    const externalResults = await Promise.all(
      cocktails
        .filter(({ idDrink }) => !internalCocktails[idDrink])
        .map(async ({ idDrink }) => await this.externalDatasource.getCocktailDetail(idDrink))
    );
    const externalCocktails: cocktailMap = {};
    externalResults.forEach((result) => {
      if (!result.isError && result.success) {
        externalCocktails[result.success.id] = result.success;
      }
    });

    // Saves only what doesn't exist in storage
    void this.saveCocktails(Object.values(externalCocktails));

    // Assemble final result and BAMM
    const finalResult: Cocktail[] = [];
    cocktails.forEach(({ idDrink }) => {
      if (internalCocktails[idDrink]) return finalResult.push(internalCocktails[idDrink]);
      if (externalCocktails[idDrink]) return finalResult.push(externalCocktails[idDrink]);
    });

    return finalResult;
  }

  async execute(query: getCocktailsQuery) {
    const encodedQuery = `${Object.keys(query)[0]}${encodeURIComponent(Object.values(query)[0])}`;
    const cache = await this.cacheService.get<Cocktail[]>(`cocktail:list:${encodedQuery}`);
    if (cache) return new Right(cache);

    const listResult = await this.externalDatasource.getCocktailsList(query);
    if (listResult.isError) return listResult;

    const cocktails: Cocktail[] = await this.getDetails(listResult.success);

    void this.cacheService.set(`cocktail:list:${encodedQuery}`, cocktails);
    return new Right(cocktails);
  }
}
