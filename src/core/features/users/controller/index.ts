import createAuthenticateUserUsecase from '../usecases/authenticate-user/inedx';
import createChangePasswordUsecase from '../usecases/change-password';
import createDecodeUserTokenUsecase from '../usecases/decode-user-token';
import createInsertUserUsecase from '../usecases/insert-user';
import createSignUserTokenUsecase from '../usecases/sign-user-token';
import createUpdateUserUsecase from '../usecases/update-user';
import createValidateUserUsecase from '../usecases/validate-user';
import UserController from './controller';

const createUserController = () => new UserController(
  createValidateUserUsecase(),
  createInsertUserUsecase(),
  createSignUserTokenUsecase(),
  createAuthenticateUserUsecase(),
  createDecodeUserTokenUsecase(),
  createChangePasswordUsecase(),
  createUpdateUserUsecase()
);

export default createUserController;
