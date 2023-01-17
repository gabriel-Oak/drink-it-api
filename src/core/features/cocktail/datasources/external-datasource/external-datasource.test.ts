import CocktailExternalDatasource from './external-datasouce';
import { IHttpService } from '../../../../utils/services/http-service/types';
import { mock, mockReset } from 'jest-mock-extended';
import { ILoggerService } from '../../../../utils/services/logger/types';
import { CocktailDatasourceError, ICocktailExternalDatasource } from './types';
import { Left, Right } from '../../../../utils/types';
import { cocktailDetailResponse, cocktailsListMock } from '../../mocks/cocktail';
import { cocktailList } from '../../models/get-cocktails';
import Cocktail from '../../models/cocktail';
import createCocktailExternalDatasource from '.';

describe('CocktailExternalDatasouce Tests', () => {
  const httpServiceMock = mock<IHttpService>();
  const LoggerServiceMock = mock<ILoggerService>();

  const datasource: ICocktailExternalDatasource = new CocktailExternalDatasource(
    httpServiceMock,
    LoggerServiceMock
  );

  beforeEach(() => {
    mockReset(httpServiceMock);
    mockReset(LoggerServiceMock);
  });

  it('Should create datasource instance', () => {
    const instance = createCocktailExternalDatasource();
    expect(instance).toBeInstanceOf(CocktailExternalDatasource);
  })

  it('Should get cocktailList', async () => {
    httpServiceMock.get.mockImplementation(async () => cocktailsListMock);
    const result = await datasource.getCocktailsList({ i: 'vodka' });

    expect(result).toBeInstanceOf(Right);
    expect((result as Right<cocktailList>).success[0])
      .toEqual(cocktailsListMock.drinks[0]);
  });

  it('Should handle source api error for list', async () => {
    httpServiceMock.get.mockRejectedValue(Error('Opps, service offline'));
    const result = await datasource.getCocktailsList({ i: 'vodka' });

    expect(result).toBeInstanceOf(Left);
    expect((result as Left<unknown>).error)
      .toBeInstanceOf(CocktailDatasourceError);
  });

  it('Should get cocktail details', async () => {
    httpServiceMock.get.mockImplementation(async () => cocktailDetailResponse);
    const result = await datasource.getCocktailDetail('11007');

    expect(result).toBeInstanceOf(Right);
    expect((result as Right<unknown>).success).toBeInstanceOf(Cocktail);
  });

  it('Should handle source api error for details', async () => {
    httpServiceMock.get.mockRejectedValue(Error('Opps, service offline'));
    const result = await datasource.getCocktailDetail('11007');

    expect(result).toBeInstanceOf(Left);
    expect((result as Left<unknown>).error)
      .toBeInstanceOf(CocktailDatasourceError);
  });
});
