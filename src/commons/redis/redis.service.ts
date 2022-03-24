import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  public async get(key: string): Promise<void> {
    return await this.cache.get(key);
  }

  public async set(key: string, value: any, ttl: any): Promise<void> {
    return await this.cache.set(key, value, ttl);
  }

  public async del(key: string): Promise<void> {
    return await this.cache.del(key);
  }
}
