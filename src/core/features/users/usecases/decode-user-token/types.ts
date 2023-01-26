import BaseError from '../../../../utils/errors/base-error';
import { Either } from '../../../../utils/types';
import { InternalUserDatasourceError } from '../../datasources/internal-datasource/types';
import User from '../../models/user';

export class DecodeUserInvalidTokenError extends BaseError {
  public readonly type = 'decode-user-invalid-token';
  constructor() {
    super('Sorry token format is not valid, try to sing in again');
  }
}

export class DecodeUserNotFoundError extends BaseError {
  public readonly type = 'decode-user-not-found';
  constructor() {
    super('User not found, try to sing in again');
  }
}

export type decodeUserTokenErrors = DecodeUserInvalidTokenError
| DecodeUserNotFoundError
| InternalUserDatasourceError

export interface IDecodeUserTokenUsecase {
  execute: (token: string) => Promise<Either<decodeUserTokenErrors, User>>;
}
