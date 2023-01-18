import createCocktailExternalDatasource from '../../datasources/external-datasource';
import createInternalCocktailDatasource from '../../datasources/internal-datasource';
import GetDetailsUsecase from './get-details';
import { IGetDetailsUsecase } from './type';

const createGetDetailUsecase = (): IGetDetailsUsecase => new GetDetailsUsecase(
  createCocktailExternalDatasource(),
  createInternalCocktailDatasource()
);

export default createGetDetailUsecase;
