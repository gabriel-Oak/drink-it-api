import { mock, mockReset } from 'jest-mock-extended'
import { CocktailDatasourceError, ICocktailExternalDatasource } from '../../datasources/external-datasource/types';
import { IGetCocktailsUsecase } from './types';
import GetCocktailsUsecase from './get-cocktails-usecase';
import { cocktailDetailMock, cocktailsListMock } from '../../mocks/cocktail';
import { Left, Right } from '../../../../utils/types';
import Cocktail from '../../models/cocktail';
import { IInternalCocktailDatasource } from '../../datasources/internal-datasource/types';

describe('GetCocktailsUsecase Tests', () => {
  const externalDatasourceMock = mock<ICocktailExternalDatasource>();
  const internalDatasourceMock = mock<IInternalCocktailDatasource>();
  const usecase: IGetCocktailsUsecase = new GetCocktailsUsecase(
    externalDatasourceMock,
    internalDatasourceMock
  );

  beforeEach(() => {
    mockReset(externalDatasourceMock);
    mockReset(internalDatasourceMock);
  });

  it('Should get full cocktails list', async () => {
    externalDatasourceMock.getCocktailsList
      .mockImplementation(async () => new Right(cocktailsListMock.drinks));
    externalDatasourceMock.getCocktailDetail
      .mockImplementation(async () => new Right(Cocktail.fromSource(cocktailDetailMock.drinks[0] as any)));
    const result = await usecase.execute({ i: 'vodka' });

    expect(result).toBeInstanceOf(Right);
    expect((result as Right<unknown>).success).toBeInstanceOf(Array<Cocktail>);
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
    externalDatasourceMock.getCocktailDetail
      .mockImplementation(async () => new Left(new CocktailDatasourceError('Ooops')));
    const result = await usecase.execute({ i: 'vodka' });

    expect(result).toBeInstanceOf(Right);
    expect((result as Right<unknown[]>).success.length).toBe(0);
  });
});
