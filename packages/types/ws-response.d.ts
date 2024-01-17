import { Message } from './document'

export interface WebSocketResponse {
  success: boolean
  statusCode: number
  payload: object | null
}

export interface WebSocketError {
  success: boolean
  statusCode: number
  error: string
  message: string | null
}

export interface UserChatInitial extends WebSocketResponse {
  payload: {
    userId: string
    totalUnread: number
    rooms: [UserChatInitialRoom]
  }
}

export interface UserChatInitialRoom {
  roomId: string
  userUnread: number
  recentMsg: Message
}
