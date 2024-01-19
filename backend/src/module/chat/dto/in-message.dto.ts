import { Message } from '@just-chat/types'
import { IsNotEmpty, IsString } from 'class-validator'

export class InMessageDto implements Message {
  @IsString()
  @IsNotEmpty()
  msgId: string

  @IsString()
  @IsNotEmpty()
  senderId: string

  @IsString()
  @IsNotEmpty()
  receiverId: string

  @IsString()
  @IsNotEmpty()
  roomId: string

  @IsString()
  @IsNotEmpty()
  content: string
}
