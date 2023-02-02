import { Left } from '../../../../utils/types';
import { IInternalUserDatasource } from '../../datasources/internal-datasource/types';
import User, { UserProps } from '../../models/user';
import { IUpdateUserUsecase, UpdateUserInvalidPassError } from './types';

export default class UpdateUserUsecase implements IUpdateUserUsecase {
  constructor(
    private readonly userDatasource: IInternalUserDatasource
  ) {}

  async execute(user: User, payload: UserProps) {
    return null as unknown as Left<UpdateUserInvalidPassError>;
  }
}
