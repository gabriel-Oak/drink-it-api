import SignUserTokenUsecase from './sign-user-token';
import { ISignUserTokenUsecase } from './types';

const createSignUserTokenUsecase = (): ISignUserTokenUsecase => new SignUserTokenUsecase();

export default createSignUserTokenUsecase;
