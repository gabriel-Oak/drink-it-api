import { mock, mockReset } from 'jest-mock-extended';
import { Repository } from 'typeorm';
import User from '../../models/user';
import { ILoggerService } from '../../../../utils/services/logger/types';
import InternalUserDatasource from './internal-user-datasource';
import { IInternalUserDatasource } from './types';

describe('InternalUserDatasource Tests', () => {
  const repository = mock<Repository<User>>();
  const logger = mock<ILoggerService>();
  const datasource: IInternalUserDatasource = new InternalUserDatasource(repository, logger);

  beforeEach(() => {
    mockReset(repository);
    mockReset(logger);
  });

  it('Should find user by email', async () => {
    await datasource.findByEmail('hiremexteamplsohmygod@gmaiu.com');
  });
});
