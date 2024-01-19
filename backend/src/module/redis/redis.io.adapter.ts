import { Injectable } from '@nestjs/common'
import { IoAdapter } from '@nestjs/platform-socket.io'
import { createAdapter } from '@socket.io/redis-adapter'
import { RedisService } from './redis.service'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class RedisIoAdapter extends IoAdapter {
  constructor(
    private redisService: RedisService,
    private configService: ConfigService,
  ) {
    super()
  }

  private adapterConstructor: ReturnType<typeof createAdapter>

  async connectToRedis(): Promise<void> {
    await this.redisService.connect()
    const pubClient = this.redisService.getPubClient()
    const subClient = this.redisService.getSubClient()
    this.adapterConstructor = createAdapter(pubClient, subClient)
  }

  createIOServer(port: number, options?: any) {
    const server = super.createIOServer(port, options)
    server.adapter(this.adapterConstructor)
    return server
  }
}
