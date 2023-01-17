import CocktailExternalDatasource from './external-datasouce';
import { IHttpService } from '../../../../utils/services/http-service/types';
import { mock, mockReset } from 'jest-mock-extended';
import { ILoggerService } from '../../../../utils/services/logger/types';
import { CocktailDatasourceError, ICocktailExternalDatasource } from './types';
import { Left, Right } from '../../../../utils/types';
import { cocktailsListMock } from '../../mocks/cocktail';
import { cocktailList } from '../../models/get-cocktails';

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

  it('Should get cocktailList', async () => {
    httpServiceMock.get.mockImplementation(async () => cocktailsListMock);
    const result = await datasource.getCocktailsList({ i: 'vodka' });

    expect(result).toBeInstanceOf(Right);
    expect((result as Right<cocktailList>).success[0])
      .toEqual(cocktailsListMock.drinks[0]);
  });

  it('Should handle source api error', async () => {
    httpServiceMock.get.mockRejectedValue(Error('Opps, service offline'));
    const result = await datasource.getCocktailsList({ i: 'vodka' });

    expect(result).toBeInstanceOf(Left);
    expect((result as Left<unknown>).error)
      .toBeInstanceOf(CocktailDatasourceError);
  });
});
