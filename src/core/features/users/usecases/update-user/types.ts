import BaseError from '../../../../utils/errors/base-error';
import { Either } from '../../../../utils/types';
import { InternalUserDatasourceError } from '../../datasources/internal-datasource/types';
import User, { UserProps } from '../../models/user';

export class UpdateUserInvalidPassError extends BaseError {
  public readonly type = 'update-user-invalid-pass';

  constructor() {
    super('Password didn\'t match, please check its spelling');
  }
}

export type updateUserErrors = UpdateUserInvalidPassError
| InternalUserDatasourceError;

export interface IUpdateUserUsecase {
  execute: (user: User, payload: Partial<Omit<UserProps, 'id'>>) => Promise<Either<updateUserErrors, User>>;
}
