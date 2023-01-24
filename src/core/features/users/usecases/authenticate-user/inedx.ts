import createInternalUserDatasource from '../../datasources/internal-datasource';
import AuthenticateUserUsecase from './authenticate-user';
import { IAuthenticateUserUsecase } from './types';

const createAuthenticateUserUsecase = (): IAuthenticateUserUsecase => new AuthenticateUserUsecase(
  createInternalUserDatasource()
);

export default createAuthenticateUserUsecase;
