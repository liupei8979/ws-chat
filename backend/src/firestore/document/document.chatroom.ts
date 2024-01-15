import { Room, Message } from '@just-chat/types'
import { IsNumber, IsString, ValidateNested } from 'class-validator'

export class RoomDocument implements Room {
  static collectionName = 'chatrooms'

  @IsString()
  roomId: string

  @IsString()
  title: string

  @IsString({ each: true })
  members: string[]

  @ValidateNested({ each: true })
  // @Type(() => Message)
  messages: Message[]

  @IsNumber()
  recentMsgSeq: number

  // @IsObject()
  // @Validate(customValidator)
  recentUserRead: { [userId: string]: number }
}
