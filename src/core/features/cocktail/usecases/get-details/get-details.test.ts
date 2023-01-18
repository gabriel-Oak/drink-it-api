import { mock, mockReset } from 'jest-mock-extended';
import { Left, Right } from '../../../../utils/types';
import { ICocktailExternalDatasource } from '../../datasources/external-datasource/types';
import { IInternalCocktailDatasource } from '../../datasources/internal-datasource/types';
import { cocktailDetailMock } from '../../mocks/cocktail';
import Cocktail from '../../models/cocktail';
import GetDetailsUsecase from './get-details';
import { DetailsNotFoundError, IGetDetailsUsecase } from './type';

describe('GetDetailsUsecase Tests', () => {
  const internalDatasourceMock = mock<IInternalCocktailDatasource>();
  const externalDatasourceMock = mock<ICocktailExternalDatasource>();
  const cocktailMock = Cocktail.fromSource(cocktailDetailMock as any);
  const usecase: IGetDetailsUsecase = new GetDetailsUsecase(
    externalDatasourceMock,
    internalDatasourceMock
  );

  beforeEach(() => {
    mockReset(internalDatasourceMock);
    mockReset(externalDatasourceMock);
  });

  it('Should get cocktail internally', async () => {
    internalDatasourceMock.findOne.mockImplementation(async () => new Right(cocktailMock));
    const result = await usecase.execute('34897');

    expect(result).toBeInstanceOf(Right);
    expect((result as Right<unknown>).success).toBeInstanceOf(Cocktail);
    expect(externalDatasourceMock.getCocktailDetail).not.toHaveBeenCalled();
  });

  it('Should get cocktail external', async () => {
    internalDatasourceMock.findOne.mockImplementation(async () => new Right(null));
    externalDatasourceMock.getCocktailDetail.mockImplementation(async () => new Right(cocktailMock));
    const result = await usecase.execute('34897', true);

    expect(result).toBeInstanceOf(Right);
    expect((result as Right<unknown>).success).toBeInstanceOf(Cocktail);
    expect(externalDatasourceMock.getCocktailDetail).toHaveBeenCalled();
  });

  it('Should return DetailsNotFoundError', async () => {
    internalDatasourceMock.findOne.mockImplementation(async () => new Right(null));
    externalDatasourceMock.getCocktailDetail.mockImplementation(async () => new Right(null));
    const result = await usecase.execute('34897');

    expect(result).toBeInstanceOf(Left);
    expect((result as Left<unknown>).error).toBeInstanceOf(DetailsNotFoundError);
  });
});
