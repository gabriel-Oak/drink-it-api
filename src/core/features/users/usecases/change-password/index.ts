import createInternalUserDatasource from '../../datasources/internal-datasource';
import ChangePasswordUsecase from './change-password';
import { IChangePasswordUsecase } from './types';

const createChangePasswordUsecase = (): IChangePasswordUsecase => new ChangePasswordUsecase(
  createInternalUserDatasource()
);

export default createChangePasswordUsecase;
