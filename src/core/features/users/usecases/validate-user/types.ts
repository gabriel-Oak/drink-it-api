import BaseError from '../../../../utils/errors/base-error';
import { Either } from '../../../../utils/types';
import User from '../../models/user';

export class ValidadeUserError extends BaseError {
  public readonly type = 'validate-user';
}
export interface ValidadeUserUsecase {
  execute: (user: User) => Either<ValidadeUserError, unknown>;
}
