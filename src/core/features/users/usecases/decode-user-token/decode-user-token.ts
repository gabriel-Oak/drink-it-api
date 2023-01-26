import { Either, Left } from '../../../../utils/types';
import { IInternalUserDatasource } from '../../datasources/internal-datasource/types';
import User, { UserProps } from '../../models/user';
import { DecodeUserInvalidTokenError, DecodeUserNotFoundError, decodeUserTokenErrors, IDecodeUserTokenUsecase } from './types';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../../../utils/constants';

export default class DecodeUserTokenUsecase implements IDecodeUserTokenUsecase {
  constructor(private readonly userDatasource: IInternalUserDatasource) {}

  async execute(token: string) {
    try {
      const decodedUser = jwt.verify(token, JWT_SECRET) as UserProps;
      const userResult = await this.userDatasource.findById(decodedUser.id!);
      if (userResult.isError || userResult.success) {
        return userResult as unknown as Either<decodeUserTokenErrors, User>;
      }

      return new Left(new DecodeUserNotFoundError());
    } catch (_) {
      return new Left(new DecodeUserInvalidTokenError());
    }
  }
}
