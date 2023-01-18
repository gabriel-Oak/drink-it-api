import { FastifyReply, FastifyRequest } from 'fastify';
import { mock, mockDeep, mockReset } from 'jest-mock-extended';
import HttpError from '../../../utils/errors/http-error';
import { Left, Right } from '../../../utils/types';
import { CocktailDatasourceError } from '../datasources/external-datasource/types';
import { cocktailDetailMock } from '../mocks/cocktail';
import Cocktail from '../models/cocktail';
import { IGetCocktailsUsecase } from '../usecases/get-cocktails/types';
import FastifyCocktailController from './controller';

describe('LocationsController tests', () => {
  const requestMock = mock<FastifyRequest>({ query: { i: 'vodka' } } as any);
  const replyMock = mockDeep<FastifyReply>({ funcPropSupport: true });
  const getCocktailsMock = mock<IGetCocktailsUsecase>();
  const controller = new FastifyCocktailController(getCocktailsMock);
  const successMock = [Cocktail.fromSource(cocktailDetailMock as any)];

  beforeEach(() => {
    mockReset(getCocktailsMock);
    mockReset(replyMock);
    replyMock.code.mockImplementation(() => replyMock);
  });

  it('Should return cocktails', async () => {
    getCocktailsMock.execute
      .mockImplementation(async () => new Right(successMock));
    await controller.getCocktails(requestMock, replyMock);

    expect(replyMock.send).toBeCalledWith(successMock);
  });

  it('Should return not found location', async () => {
    getCocktailsMock.execute
      .mockImplementation(async () => new Left(new CocktailDatasourceError('Opps')));
    await controller.getCocktails(requestMock, replyMock);

    expect(replyMock.code).toBeCalledWith(500);
    expect(replyMock.send).toBeCalledWith(new HttpError({
      statusCode: 500,
      message: 'Opps'
    }));
  });

  it('Should return error when no parameters', async () => {
    await controller.getCocktails({ ...requestMock, query: {} }, replyMock);

    expect(replyMock.code).toBeCalledWith(400);
    expect(replyMock.send).toBeCalledWith(new HttpError({
      statusCode: 400,
      message: 'Sorry, you need to specify a searching parameter'
    }));
  });
});
