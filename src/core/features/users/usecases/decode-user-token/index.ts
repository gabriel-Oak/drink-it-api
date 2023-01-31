import createInternalUserDatasource from '../../datasources/internal-datasource';
import DecodeUserTokenUsecase from './decode-user-token';
import { IDecodeUserTokenUsecase } from './types';

const createDecodeUserTokenUsecase = (): IDecodeUserTokenUsecase => new DecodeUserTokenUsecase(
  createInternalUserDatasource()
);

export default createDecodeUserTokenUsecase;
