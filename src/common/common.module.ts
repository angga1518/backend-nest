import { Module } from '@nestjs/common';
import { RedisCache } from './redis/redis';

@Module({
  providers: [RedisCache],
  exports: [RedisCache],
})
export class CommonModule {}
