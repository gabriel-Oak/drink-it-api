import { mock, mockReset } from 'jest-mock-extended';
import { Repository } from 'typeorm';
import Cocktail from '../../models/cocktail';
import InternalCocktailDatasource from './internal-datasource';
import { IInternalCocktailDatasource, InternalCocktailDatasourceError } from './types';
import { ILoggerService } from '../../../../utils/services/logger/types';
import Measure from '../../models/measure';
import Ingredient from '../../models/ingredient';
import { Left, Right } from '../../../../utils/types';
import { cocktailDetailMock } from '../../mocks/cocktail';

describe('InternalCocktailDatasource Tests', () => {
  const cocktailRepositoryMock = mock<Repository<Cocktail>>();
  const measureRepositoryMock = mock<Repository<Measure>>();
  const ingredientRepositoryMock = mock<Repository<Ingredient>>();
  const loggerMock = mock<ILoggerService>();
  const cocktailMock = Cocktail.fromSource(cocktailDetailMock as any);

  const datasource: IInternalCocktailDatasource = new InternalCocktailDatasource(
    cocktailRepositoryMock,
    measureRepositoryMock,
    ingredientRepositoryMock,
    loggerMock
  );

  beforeEach(() => {
    mockReset(cocktailRepositoryMock);
    mockReset(measureRepositoryMock);
    mockReset(ingredientRepositoryMock);
    mockReset(loggerMock);
  });

  it('Should save cocktail', async () => {
    cocktailRepositoryMock.save.mockImplementation(async (c) => c as any);
    measureRepositoryMock.save.mockImplementation(async (m) => m as any);
    ingredientRepositoryMock.save.mockImplementation(async (i) => i as any);
    const result = await datasource.saveOne(cocktailMock);

    expect(result).toBeInstanceOf(Right);
  });

  it('Shouldn\'t save cocktail if exist', async () => {
    cocktailRepositoryMock.findOne.mockImplementationOnce(async () => cocktailMock);
    const result = await datasource.saveOne(cocktailMock);
    expect(result).toBeInstanceOf(Right);
    expect(cocktailRepositoryMock.save).not.toHaveBeenCalled();

    ingredientRepositoryMock.findOne.mockImplementationOnce(async () => cocktailMock.measures[0].ingredient);
    measureRepositoryMock.findOne.mockImplementationOnce(async () => cocktailMock.measures[0]);
    const result2 = await datasource.saveOne(cocktailMock);

    expect(result2).toBeInstanceOf(Right);
    expect(measureRepositoryMock.save).not.toHaveBeenCalled();
    expect(ingredientRepositoryMock.save).not.toHaveBeenCalled();
  });

  it('Should deal with database error', async () => {
    cocktailRepositoryMock.findOne.mockRejectedValue(Error('HOLY MOLLY WE GOT AN OLLIE'));
    const result = await datasource.saveOne(cocktailMock);

    expect(result).toBeInstanceOf(Left);
    expect((result as Left<unknown>).error).toBeInstanceOf(InternalCocktailDatasourceError);
  });

  it('Should find one cocktail', async () => {
    cocktailRepositoryMock.findOne.mockImplementation(async () => cocktailMock);
    const result = await datasource.findOne('7382');

    expect(result).toBeInstanceOf(Right);
    expect((result as Right<unknown>).success).toBeInstanceOf(Cocktail);
  });

  it('Should deal with finding errors', async () => {
    cocktailRepositoryMock.findOne.mockRejectedValue(Error('Crap you to beaultiful for this'));
    const result = await datasource.findOne('7382');

    expect(result).toBeInstanceOf(Left);
    expect((result as Left<unknown>).error).toBeInstanceOf(InternalCocktailDatasourceError);
  });

  it('Should find may cocktails', async () => {
    cocktailRepositoryMock.find.mockImplementation(async () => [cocktailMock]);
    const result = await datasource.findMany(['7382']);

    expect(result).toBeInstanceOf(Right);
    expect((result as Right<unknown>).success).toBeInstanceOf(Array<Cocktail>);
  });

  it('Should deal with finding many errors', async () => {
    cocktailRepositoryMock.find.mockRejectedValue(Error('Crap you to beaultiful for this'));
    const result = await datasource.findMany(['7382']);

    expect(result).toBeInstanceOf(Left);
    expect((result as Left<unknown>).error).toBeInstanceOf(InternalCocktailDatasourceError);
  });
});
