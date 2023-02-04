import createInternalUserDatasource from '../../datasources/internal-datasource';
import { IUpdateUserUsecase } from './types';
import UpdateUserUsecase from './update-user';

const createUpdateUserUsecase = (): IUpdateUserUsecase => new UpdateUserUsecase(
  createInternalUserDatasource()
);

export default createUpdateUserUsecase;
