import { IInternalUserDatasource } from './types';
import InternalUserDatasource from './internal-user-datasource';
import DatabaseService from '../../../../utils/services/database-service';
import User from '../../models/user';
import createLoggerService from '../../../../utils/services/logger';

let instance: IInternalUserDatasource;

const createInternalUserDatasource = (): IInternalUserDatasource => {
  if (!instance) {
    instance = new InternalUserDatasource(
      DatabaseService.getRepository(User),
      createLoggerService()
    );
  }
  return instance;
}

export default createInternalUserDatasource;
