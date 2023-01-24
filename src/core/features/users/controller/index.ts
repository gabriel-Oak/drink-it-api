import createInsertUserUsecase from '../usecases/insert-user';
import createSignUserTokenUsecase from '../usecases/sign-user-token';
import createValidateUserUsecase from '../usecases/validate-user';
import UserController from './controller';

const createUserController = () => new UserController(
  createValidateUserUsecase(),
  createInsertUserUsecase(),
  createSignUserTokenUsecase()
);

export default createUserController;
