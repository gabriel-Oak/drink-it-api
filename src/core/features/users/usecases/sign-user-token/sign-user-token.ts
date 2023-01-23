import User from '../../models/user';
import { ISignUserTokenUsecase } from './types';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../../../utils/constants';

export default class SignUserTokenUsecase implements ISignUserTokenUsecase {
  execute(user: User) {
    return jwt.sign({
      ...user,
      password: undefined
    }, JWT_SECRET, {
      expiresIn: '24h'
    });
  }
}
