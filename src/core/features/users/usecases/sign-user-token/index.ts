import createCacheService from '../../../../utils/services/cache-service';
import SignUserTokenUsecase from './sign-user-token';
import { ISignUserTokenUsecase } from './types';

const createSignUserTokenUsecase = (): ISignUserTokenUsecase => new SignUserTokenUsecase(
  createCacheService()
);

export default createSignUserTokenUsecase;
