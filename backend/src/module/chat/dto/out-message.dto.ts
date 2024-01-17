import { Message } from '@just-chat/types'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class OutMessageDto implements Message {
  @IsString()
  @IsNotEmpty()
  msgId: string

  @IsNumber()
  @IsNotEmpty()
  msgSeq: number

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

  @IsNumber()
  @IsNotEmpty()
  timestamp: number
}
