import { ILoggerService } from '../../../../utils/services/logger/types';
import { Left, Right } from '../../../../utils/types';
import { Repository } from 'typeorm';
import User from '../../models/user';
import { IInternalUserDatasource, InternalUserDatasourceError } from './types';

export default class InternalUserDatasource implements IInternalUserDatasource {
  constructor(
    private readonly userRepository: Repository<User>,
    private readonly logger: ILoggerService
  ) { }

  async findByEmail(email: string) {
    try {
      const user = await this.userRepository.findOneBy({ email });
      return new Right(user);
    } catch (e) {
      const error = new InternalUserDatasourceError(
        (e as any).message || `Oops, sorry got an error searching for ${email}`,
        { ...(e as any), email }
      );
      this.logger.error(error.message, error);
      return new Left(error);
    }
  }

  async findById(userId: string) {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      return new Right(user);
    } catch (e) {
      const error = new InternalUserDatasourceError(
        (e as any).message || `Oops, sorry got an error searching for id${userId}`,
        { ...(e as any), userId }
      );
      this.logger.error(error.message, error);
      return new Left(error);
    }
  }

  async save(user: User) {
    try {
      const result = await this.userRepository.save(user);
      console.log(result);

      return new Right(result);
    } catch (e) {
      const error = new InternalUserDatasourceError(
        (e as any).message || `Oops, sorry got an error saving user${user.name}`,
        { ...(e as any), user }
      );
      this.logger.error(error.message, error);
      return new Left(error);
    }
  }

  async remove(userId: string) {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) throw new Error(`Oops, user ${userId} not found, might be already deleted`);

      const result = await this.userRepository.remove(user);
      return new Right(result);
    } catch (e) {
      const error = new InternalUserDatasourceError(
        (e as any).message || `Oops, sorry got an error searching for id${userId}`,
        { ...(e as any), userId }
      );
      this.logger.error(error.message, error);
      return new Left(error);
    }
  }
}
