/* eslint-disable @typescript-eslint/consistent-indexed-object-style */

import { CocktailFromSourceProps } from './cocktail';

export type cocktailList = Array<{
  strDrink: string;
  strDrinkThumb: string;
  idDrink: string;
}>

export interface GetCocktailDetailsResponse {
  drinks: CocktailFromSourceProps[] | null;
}
export interface GetCocktailsListResponse {
  drinks: cocktailList;
}

export type getCocktailsQuery = {
  a: string;
} | {
  i: string;
} | {
  c: string;
} | {
  g: string;
}
