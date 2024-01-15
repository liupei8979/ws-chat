import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthController } from './auth/auth.controller'
import { AuthModule } from './auth/auth.module'
import { ChatModule } from './chat/chat.module'
import { FirestoreModule } from './firestore/firestore.module'
import { RedisModule } from './redis/redis.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [AuthModule, ChatModule, FirestoreModule, RedisModule, UserModule],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
