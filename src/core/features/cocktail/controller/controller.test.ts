import { Request, Response } from 'express';
import { mock, mockDeep, mockReset } from 'jest-mock-extended';
import HttpError from '../../../utils/errors/http-error';
import { Left, Right } from '../../../utils/types';
import { CocktailDatasourceError } from '../datasources/external-datasource/types';
import { cocktailDetailMock } from '../mocks/cocktail';
import Cocktail from '../models/cocktail';
import { IGetCocktailsUsecase } from '../usecases/get-cocktails/types';
import CocktailController from './controller';

describe('LocationsController tests', () => {
  const requestMock = mock<Request>({ query: { i: 'vodka' } } as any);
  const responseMock = mockDeep<Response>({ funcPropSupport: true });
  const getCocktailsMock = mock<IGetCocktailsUsecase>();
  const controller = new CocktailController(getCocktailsMock);
  const successMock = [Cocktail.fromSource(cocktailDetailMock as any)];

  beforeEach(() => {
    mockReset(getCocktailsMock);
    mockReset(responseMock);
    responseMock.status.mockImplementation(() => responseMock);
  });

  it('Should return cocktails', async () => {
    getCocktailsMock.execute
      .mockImplementation(async () => new Right(successMock));
    await controller.getCocktails(requestMock, responseMock);

    expect(responseMock.json).toBeCalledWith(successMock);
  });

  it('Should return not found location', async () => {
    getCocktailsMock.execute
      .mockImplementation(async () => new Left(new CocktailDatasourceError('Opps')));
    await controller.getCocktails(requestMock, responseMock);

    expect(responseMock.status).toBeCalledWith(500);
    expect(responseMock.json).toBeCalledWith(new HttpError({
      statusCode: 500,
      message: 'Opps'
    }));
  });
});
