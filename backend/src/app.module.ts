import { MiddlewareConsumer, Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthModule } from './module/auth/auth.module'
import { ChatModule } from './module/chat/chat.module'
import { FirestoreModule } from './module/firestore/firestore.module'
import { RedisModule } from './module/redis/redis.module'
import { UserModule } from './module/user/user.module'
import * as fs from 'fs'
import * as path from 'path'
import * as YAML from 'yaml'
import * as swaggerUi from 'swagger-ui-express'
import { LoggerMiddleware } from './utils/middlewares/logger.middleware'
import { RoomModule } from './module/room/room.module'

const YAML_PATH = path.resolve(__dirname, '../api.swagger.yaml')
const apiDocument = YAML.parse(fs.readFileSync(YAML_PATH, 'utf8'))

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FirestoreModule.forRoot({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        keyFilename: configService.get<string>('FIRESTORE_KEY_FILENAME'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    RedisModule,
    ChatModule,
    UserModule,
    RoomModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*')
    consumer
      .apply(swaggerUi.serve, swaggerUi.setup(apiDocument))
      .forRoutes('api/docs')
  }
}
