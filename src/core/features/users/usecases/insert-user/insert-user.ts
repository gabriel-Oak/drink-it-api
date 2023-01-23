import { Left } from '../../../../utils/types';
import { IInternalUserDatasource } from '../../datasources/internal-datasource/types';
import User, { UserProps } from '../../models/user';
import { IInsertUserUsecase, InsertUserAlreadyExist } from './types';

export default class InsertUserUsecase implements IInsertUserUsecase {
  constructor(private readonly userDatasource: IInternalUserDatasource) { }

  async execute(user: UserProps) {
    const existResult = await this.userDatasource.findByEmail(user.email);
    if (existResult.isError) return existResult;
    if (existResult.success) return new Left(new InsertUserAlreadyExist());

    const userResult = await this.userDatasource.save(new User(user));
    return userResult;
  }
}
