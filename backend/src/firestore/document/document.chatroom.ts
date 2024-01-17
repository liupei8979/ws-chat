import { Room } from '@just-chat/types'
import { IsNumber, IsString } from 'class-validator'

export class RoomDocument implements Room {
  static collectionName = 'chatrooms'

  @IsString()
  roomId: string

  @IsString()
  title: string

  @IsString({ each: true })
  members: string[]

  @IsNumber()
  recentMsgSeq: number

  // @IsObject()
  // @Validate(customValidator)
  recentUserRead: { [userId: string]: number }
}
