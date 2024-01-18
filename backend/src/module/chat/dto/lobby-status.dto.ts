import { ChatLobbyRoomStatus, ChatLobbyStatus } from '@just-chat/types'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { OutMessageDto } from './out-message.dto'

export class LobbyStatusDto implements ChatLobbyStatus {
  @IsString()
  @IsNotEmpty()
  userId: string

  @IsNumber()
  @IsNotEmpty()
  totalUnread: number

  rooms: LobbyRoomStatusDto[]
}
export class LobbyRoomStatusDto implements ChatLobbyRoomStatus {
  @IsString()
  @IsNotEmpty()
  roomId: string

  @IsString()
  title: string

  @IsNumber()
  @IsNotEmpty()
  userUnread: number

  recentMsg: OutMessageDto
}
