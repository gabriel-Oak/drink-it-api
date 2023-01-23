import { IValidateUserUsecase } from './types';
import ValidateUserUsecase from './validate-user';

const createValidateUserUsecase = (): IValidateUserUsecase => new ValidateUserUsecase();

export default createValidateUserUsecase;
