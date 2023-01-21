import { ILoggerService } from '../../../../utils/services/logger/types';
import { Left } from '../../../../utils/types';
import { Repository } from 'typeorm';
import User from '../../models/user';
import { IInternalUserDatasource, InternalUserDatasourceError } from './types';

export default class InternalUserDatasource implements IInternalUserDatasource {
  constructor(
    private readonly userRepository: Repository<User>,
    private readonly logger: ILoggerService
  ) { }

  async findByEmail(email: string) {
    return new Left(null as unknown as InternalUserDatasourceError);
  }

  async findById(email: string) {
    return new Left(null as unknown as InternalUserDatasourceError);
  }

  async save(user: User) {
    return new Left(null as unknown as InternalUserDatasourceError);
  }

  async remove(user: User) {
    return new Left(null as unknown as InternalUserDatasourceError);
  }
}
