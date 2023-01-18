import { KeyType } from 'crypto';

export interface ICacheService {
  set: <T>(key: string, item: T, expirationSeconds?: number) => Promise<void>;
  get: <T>(key: string) => Promise<T | null>;
  del: (args: KeyType[]) => Promise<number | null>;
  delPrefix: (prefix: string) => Promise<number | null>;
}
