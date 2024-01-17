import { Message, Room } from '@just-chat/types'

export class RoomInfoDto implements Room {
  roomId: string
  title: string
  members: string[]
  messages: Message[]
  recentMsgSeq: number
  recentUserRead: { [userId: string]: number }
}
