import Redis from 'ioredis';
import { REDIS_HOST, REDIS_PASS, REDIS_PORT } from '../../constants';
import createLoggerService from '../logger';
import CacheService from './cache-service';
import { ICacheService } from './types';

let instance: ICacheService;

const createCacheService = (): ICacheService => {
  if (!instance) {
    instance = new CacheService(new Redis({
      port: +REDIS_PORT!,
      host: REDIS_HOST,
      password: REDIS_PASS,
      keyPrefix: 'cache'
    }), createLoggerService());
  }
  return instance;
}

export default createCacheService;
