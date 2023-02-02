import createAuthenticateUserUsecase from '../usecases/authenticate-user/inedx';
import createChangePasswordUsecase from '../usecases/change-password';
import createDecodeUserTokenUsecase from '../usecases/decode-user-token';
import createInsertUserUsecase from '../usecases/insert-user';
import createSignUserTokenUsecase from '../usecases/sign-user-token';
import createValidateUserUsecase from '../usecases/validate-user';
import UserController from './controller';

const createUserController = () => new UserController(
  createValidateUserUsecase(),
  createInsertUserUsecase(),
  createSignUserTokenUsecase(),
  createAuthenticateUserUsecase(),
  createDecodeUserTokenUsecase(),
  createChangePasswordUsecase()
);

export default createUserController;
