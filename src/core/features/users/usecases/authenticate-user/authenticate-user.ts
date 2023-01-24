import { Left, Right } from '../../../../utils/types';
import { IInternalUserDatasource } from '../../datasources/internal-datasource/types';
import { AuthenticateUserNotFoundError, AuthenticateUserWrongPasswordError, IAuthenticateUserUsecase, LoginPayload } from './types';

export default class AuthenticateUserUsecase implements IAuthenticateUserUsecase {
  constructor(
    private readonly userUsecase: IInternalUserDatasource
  ) { }

  async execute(payload: LoginPayload) {
    const userResult = await this.userUsecase.findByEmail(payload.email);
    if (userResult.isError) return userResult;

    const { success: user } = userResult;
    if (!user) return new Left(new AuthenticateUserNotFoundError());

    return await user.comparePasswords(payload.password)
      ? new Right(user)
      : new Left(new AuthenticateUserWrongPasswordError());
  }
}
