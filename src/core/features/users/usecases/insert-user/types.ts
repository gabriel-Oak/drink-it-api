import BaseError from '../../../../utils/errors/base-error';
import { Either } from '../../../../utils/types';
import { InternalUserDatasourceError } from '../../datasources/internal-datasource/types'
import User, { UserProps } from '../../models/user';
import { ValidateUserError } from '../validate-user/types'

export class InsertUserAlreadyExist extends BaseError {
  public readonly type = 'insert-user-already-exist';

  constructor() {
    super('User already exist, try a diferent email');
  }
}

export type insertUserErrors = InternalUserDatasourceError
| ValidateUserError
| InsertUserAlreadyExist;

export interface IInsertUserUsecase {
  execute: (user: UserProps) => Promise<Either<insertUserErrors, User>>;
}
