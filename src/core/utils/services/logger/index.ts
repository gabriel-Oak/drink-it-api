import { createLogger } from 'winston';
import LoggerService from './logger';
import { ILoggerService } from './types';

let instance: ILoggerService;
const createLoggerService = (): ILoggerService => {
  if (!instance) instance = new LoggerService(createLogger());
  return instance;
};

export default createLoggerService;
