import User from '../../models/user';
import { ISignUserTokenUsecase } from './types';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../../../utils/constants';
import { ICacheService } from '../../../../utils/services/cache-service/types';

export default class SignUserTokenUsecase implements ISignUserTokenUsecase {
  constructor(private readonly chage: ICacheService) { }

  execute(user: User) {
    const newUser = new User({ ...user, password: undefined });
    void this.chage.set(`user:${user.id!}`, newUser);

    return jwt.sign(newUser.getProps(), JWT_SECRET, { expiresIn: '24h' });
  }
}
