import { Left } from '../../../../utils/types';
import { IInternalUserDatasource } from '../../datasources/internal-datasource/types';
import User, { UserProps } from '../../models/user';
import { IUpdateUserUsecase, UpdateUserInvalidPassError } from './types';

export default class UpdateUserUsecase implements IUpdateUserUsecase {
  constructor(
    private readonly userDatasource: IInternalUserDatasource
  ) {}

  async execute(user: User, payload: Partial<Omit<UserProps, 'id'>>) {
    const passIsValid = payload.password && await user.comparePasswords(payload.password);
    if (!passIsValid) return new Left(new UpdateUserInvalidPassError());

    user.updateProps(payload);
    return await this.userDatasource.save(user);
  }
}
