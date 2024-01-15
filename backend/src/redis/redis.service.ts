import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { RedisClientType, createClient } from 'redis'

@Injectable()
export class RedisService {
  private pubClient: RedisClientType
  private subClient: RedisClientType

  constructor(private configService: ConfigService) {
    const redisHost = this.configService.get<string>('REDIS_HOST')
    const redisPort = this.configService.get<number>('REDIS_PORT')
    const redisUrl = `redis://${redisHost}:${redisPort}`
    this.pubClient = createClient({ url: redisUrl })
    this.subClient = this.pubClient.duplicate()
  }

  async connect(): Promise<void> {
    await Promise.all([this.pubClient.connect(), this.subClient.connect()])
  }

  getPubClient(): RedisClientType {
    return this.pubClient
  }

  getSubClient(): RedisClientType {
    return this.subClient
  }

  async set(key: string, value: string): Promise<void> {
    await this.pubClient.set(key, value)
  }

  async get(key: string): Promise<string> {
    return await this.pubClient.get(key)
  }
}
