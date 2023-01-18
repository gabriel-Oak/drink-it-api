import { mock, mockReset } from 'jest-mock-extended'
import { CocktailDatasourceError, ICocktailExternalDatasource } from '../../datasources/external-datasource/types';
import { IGetCocktailsUsecase } from './types';
import GetCocktailsUsecase from './get-cocktails-usecase';
import { cocktailDetailMock, cocktailsListMock } from '../../mocks/cocktail';
import { Left, Right } from '../../../../utils/types';
import Cocktail from '../../models/cocktail';
import { IInternalCocktailDatasource } from '../../datasources/internal-datasource/types';
import { ICacheService } from '../../../../utils/services/cache-service/types';

describe('GetCocktailsUsecase Tests', () => {
  const externalDatasourceMock = mock<ICocktailExternalDatasource>();
  const internalDatasourceMock = mock<IInternalCocktailDatasource>();
  const cacheServiceMock = mock<ICacheService>();
  const cocktailMock = Cocktail.fromSource(cocktailDetailMock.drinks[0] as any);

  const usecase: IGetCocktailsUsecase = new GetCocktailsUsecase(
    externalDatasourceMock,
    internalDatasourceMock,
    cacheServiceMock
  );

  beforeEach(() => {
    mockReset(externalDatasourceMock);
    mockReset(internalDatasourceMock);
    mockReset(cacheServiceMock);
    cacheServiceMock.get.mockImplementation(async () => null);
  });

  it('Should get full cocktails list', async () => {
    externalDatasourceMock.getCocktailsList
      .mockImplementation(async () => new Right(cocktailsListMock.drinks));
    internalDatasourceMock.findMany
      .mockImplementation(async () => new Right([cocktailMock]));
    externalDatasourceMock.getCocktailDetail
      .mockImplementation(async () => new Right(cocktailMock));
    const result = await usecase.execute({ i: 'vodka' });

    expect(result).toBeInstanceOf(Right);
    expect((result as Right<unknown>).success).toBeInstanceOf(Array<Cocktail>);
  });

  it.skip('Should get full cocktails list from cache', async () => {
    cacheServiceMock.get.mockImplementation(async () => [cocktailMock]);
    const result = await usecase.execute({ i: 'vodka' });

    expect(result).toBeInstanceOf(Right);
    expect((result as Right<unknown>).success).toBeInstanceOf(Array<Cocktail>);
    expect(externalDatasourceMock.getCocktailsList).not.toHaveBeenCalled();
  });

  it('Should deal with get list error', async () => {
    externalDatasourceMock.getCocktailsList
      .mockImplementation(async () => new Left(new CocktailDatasourceError('Ooops')));
    const result = await usecase.execute({ i: 'vodka' });

    expect(result).toBeInstanceOf(Left);
    expect((result as Left<unknown>).error).toBeInstanceOf(CocktailDatasourceError);
  });

  it('Should deal with get details error', async () => {
    externalDatasourceMock.getCocktailsList
      .mockImplementation(async () => new Right(cocktailsListMock.drinks));
    internalDatasourceMock.findMany
      .mockImplementation(async () => new Right([cocktailMock]));
    externalDatasourceMock.getCocktailDetail
      .mockImplementation(async () => new Right(cocktailMock));
    const result = await usecase.execute({ i: 'vodka' });

    expect(result).toBeInstanceOf(Right);
    expect((result as Right<unknown[]>).success.length).toBe(0);
  });
});
