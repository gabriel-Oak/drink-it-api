import createInternalUserDatasource from '../../datasources/internal-datasource';
import InsertUserUsecase from './insert-user';
import { IInsertUserUsecase } from './types';

const createInsertUserUsecase = (): IInsertUserUsecase => new InsertUserUsecase(
  createInternalUserDatasource()
);

export default createInsertUserUsecase
