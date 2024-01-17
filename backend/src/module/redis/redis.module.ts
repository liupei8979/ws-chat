import { Module } from '@nestjs/common'
import { RedisIoAdapter } from './redis.io.adapter'
import { RedisService } from './redis.service'

@Module({
  providers: [RedisService, RedisIoAdapter],
  exports: [RedisService, RedisIoAdapter],
})
export class RedisModule {}
