import { mock, mockReset } from 'jest-mock-extended';
import { Redis as RedisClient } from 'ioredis';
import { ILoggerService } from '../logger/types';
import CacheService from './cache-service';

describe('CacheService Tests', () => {
  const redisMock = mock<RedisClient>();
  const loggerMock = mock<ILoggerService>();

  const cacheService = new CacheService(redisMock, loggerMock);

  beforeEach(() => {
    mockReset(redisMock);
    mockReset(loggerMock);
  });

  it('Should cache item', async () => {
    redisMock.set.mockImplementation(async () => null);
    await cacheService.set('hello', 'cache me');
    expect(loggerMock.warn).not.toHaveBeenCalled();
  });

  it('Should handle error cache item', async () => {
    redisMock.set.mockRejectedValue(Error('Sorry pall not this time'));
    await cacheService.set('hello', 'cache me');
    expect(loggerMock.warn).toHaveBeenCalled();
  });

  it('Should get item', async () => {
    redisMock.get.mockImplementation(async () => 'Hello child');
    await cacheService.get('hello');
    expect(loggerMock.warn).not.toHaveBeenCalled();
  });

  it('Should handle error get item', async () => {
    redisMock.get.mockRejectedValue(Error('Sorry pall not this time'));
    await cacheService.get('hello');
    expect(loggerMock.warn).toHaveBeenCalled();
  });

  it('Should del item', async () => {
    redisMock.del.mockImplementation(async () => 2);
    await cacheService.del(['holla'] as any);
    expect(loggerMock.warn).not.toHaveBeenCalled();
  });

  it('Should handle error del item', async () => {
    redisMock.del.mockRejectedValue(Error('Sorry pall not this time'));
    await cacheService.del(['holla'] as any);
    expect(loggerMock.warn).toHaveBeenCalled();
  });

  it('Should del items', async () => {
    redisMock.keys.mockImplementation(async () => ['key1', 'key2']);
    redisMock.del.mockImplementation(async () => 2);
    await cacheService.delPrefix('user');
    expect(loggerMock.warn).not.toHaveBeenCalled();
  });

  it('Should handle error del items', async () => {
    redisMock.keys.mockImplementation(async () => ['key1', 'key2']);
    redisMock.del.mockRejectedValue(Error('Sorry pall not this time'));
    await cacheService.delPrefix('user');
    expect(loggerMock.warn).toHaveBeenCalled();
  });
});
