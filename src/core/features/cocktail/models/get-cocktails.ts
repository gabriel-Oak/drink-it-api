/* eslint-disable @typescript-eslint/consistent-indexed-object-style */

export type cocktailList = Array<{
  strDrink: string;
  strDrinkThumb: string;
  idDrink: string;
}>

export interface GetCocktailsListResponse {
  drinks: cocktailList
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
