import { Message } from './document'

export interface ChatLobbyStatus {
  userId: string
  totalUnread: number
  rooms: ChatLobbyRoomStatus[]
}

export interface ChatRoomStatus {}

export interface ChatLobbyRoomStatus {
  roomId: string
  userUnread: number
  recentMsg: Message
}
