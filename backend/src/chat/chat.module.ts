import { Module } from '@nestjs/common'
import { ChatService } from './chat.service'
import { ChatGateway } from './chat.gateway'
import { JwtModule } from '@nestjs/jwt'
import { RedisModule } from 'src/redis/redis.module'

@Module({
  imports: [JwtModule, RedisModule],
  controllers: [],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
