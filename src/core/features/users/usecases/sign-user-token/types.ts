import User from '../../models/user';

export interface ISignUserTokenUsecase {
  execute: (user: User) => string;
}
