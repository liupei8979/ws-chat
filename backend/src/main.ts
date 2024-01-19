import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { RedisIoAdapter } from './module/redis/redis.io.adapter'
import { RedisService } from './module/redis/redis.service'
import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const redisIoAdapter = new RedisIoAdapter(
    app.get(RedisService),
    app.get(ConfigService),
  )
  await redisIoAdapter.connectToRedis()
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe())
  // app.useGlobalFilters(new HttpExceptionFilter());
  // 글로벌로 사용하면, 소켓에서도 적용됨.

  app.useWebSocketAdapter(redisIoAdapter)

  const port = process.env.PORT || process.env.PORT_DEV
  await app.listen(port)
  Logger.log(`Server running on ${await app.getUrl()}`, 'Bootstrap')
  Logger.log(process.env.PORT_DEV)
}
bootstrap()
