import BaseError from '../../../../utils/errors/base-error';
import { Either } from '../../../../utils/types';
import { InternalUserDatasourceError } from '../../datasources/internal-datasource/types'
import User, { UserProps } from '../../models/user';

export class InsertUserAlreadyExist extends BaseError {
  public readonly type = 'insert-user-already-exist';

  constructor() {
    super('User already exist, try a different email or usernal');
  }
}

export type insertUserErrors = InternalUserDatasourceError
| InsertUserAlreadyExist;

export interface IInsertUserUsecase {
  execute: (user: Omit<UserProps, 'id'>) => Promise<Either<insertUserErrors, User>>;
}
