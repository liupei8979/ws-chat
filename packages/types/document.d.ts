export interface User {
  email: string
  username: string
  password?: string
  statusMessage: string
  friends: string[]
}

export interface Message {
  msgId: string
  msgSeq?: number
  senderId: string
  receiverId: string
  roomId: string
  content: string
  timestamp: number // UNIX timestamp
}

export interface Room {
  roomId: string
  title: string
  members: string[]
  messages: Message[]
  recentMsgSeq: number
  recentUserRead: { [userId: string]: number }
}
