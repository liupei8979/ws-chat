import { Module } from '@nestjs/common'
import { ChatService } from './chat.service'
import { ChatGateway } from './chat.gateway'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [JwtModule],
  controllers: [],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
