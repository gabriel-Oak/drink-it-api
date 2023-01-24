import BaseError from '../../../../utils/errors/base-error';
import { Either } from '../../../../utils/types';
import { InternalUserDatasourceError } from '../../datasources/internal-datasource/types';
import User from '../../models/user';

export interface LoginPayload {
  email: string;
  password: string;
}

export class AuthenticateInvalidError extends BaseError {
  public readonly type = 'authenticate-invalid';
  constructor() { super('Oh looks like you didn\'t specify an email or a password'); }
}

export class AuthenticateUserNotFoundError extends BaseError {
  public readonly type = 'authenticate-user-not-found';
  constructor() { super('Sorry couldn\'t find any user for this email =/'); }
}

export class AuthenticateUserWrongPasswordError extends BaseError {
  public readonly type = 'authenticate-user-wrong-password';
  constructor() { super('Wrong password, please try again'); }
}

export type authenticateUserErrors = InternalUserDatasourceError
| AuthenticateUserNotFoundError
| AuthenticateUserWrongPasswordError
| AuthenticateInvalidError;

export interface IAuthenticateUserUsecase {
  execute: (payload: LoginPayload) => Promise<Either<authenticateUserErrors, User>>
}
