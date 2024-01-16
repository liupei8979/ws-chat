import { MiddlewareConsumer, Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { ChatModule } from './chat/chat.module'
import { FirestoreModule } from './firestore/firestore.module'
import { RedisModule } from './redis/redis.module'
import { UserModule } from './user/user.module'
import { LoggerMiddleware } from './middlewares/logger.middleware'
import * as fs from 'fs'
import * as path from 'path'
import * as YAML from 'yaml'
import * as swaggerUi from 'swagger-ui-express'

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
