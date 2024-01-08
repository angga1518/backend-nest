import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class RedisCache {
  private readonly logger = new Logger(RedisCache.name);
  private readonly redis: Redis;

  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getClient();
  }

  public async setEx(key: string, value: string, durationInSeconds: number) {
    key = this.getKey(key);

    this.logger.log(`set redis ${key}`);
    await this.redis.set(key, value, 'EX', durationInSeconds);
  }

  public async get(key: string): Promise<string | null> {
    key = this.getKey(key);

    this.logger.log(`get redis ${key}`);
    return await this.redis.get(key);
  }

  public async del(key: string) {
    key = this.getKey(key);

    this.logger.log(`delete redis ${key}`);
    await this.redis.del(key);
  }

  // This is to prevent the same key being used in different environments
  private getKey(key: string): string {
    const env = process.env.NODE_ENV;
    if (env === 'dev' || env === 'stag') {
      return `TEST_${key}`;
    }
    return key;
  }
}
