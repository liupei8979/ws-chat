import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { RedisIoAdapter } from './redis/redis.io.adapter'
import { RedisService } from './redis/redis.service'
import { Logger } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const redisIoAdapter = new RedisIoAdapter(app.get(RedisService))
  await redisIoAdapter.connectToRedis()

  app.useWebSocketAdapter(redisIoAdapter)

  const port = process.env.PORT || process.env.PORT_DEV
  await app.listen(port)
  Logger.log(`Server running on ${await app.getUrl()}`, 'Bootstrap')
}
bootstrap()
