import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { RedisClientType, createClient } from 'redis'
import { InMessageDto } from 'src/module/chat/dto/in-message.dto'
import { OutMessageDto } from 'src/module/chat/dto/out-message.dto'
import {
  LobbyRoomStatusDto,
  LobbyStatusDto,
} from '../chat/dto/lobby-status.dto'

@Injectable()
export class RedisService {
  private logger: Logger = new Logger('RedisService')
  private pubClient: RedisClientType
  private subClient: RedisClientType

  constructor(private configService: ConfigService) {
    const redisHost = this.configService.get<string>('REDIS_HOST')
    const redisPort = this.configService.get<number>('REDIS_PORT')
    const redisUrl = `redis://${redisHost}:${redisPort}`
    this.pubClient = createClient({ url: redisUrl })
    this.subClient = this.pubClient.duplicate()
  }

  async connect(): Promise<void> {
    await Promise.all([this.pubClient.connect(), this.subClient.connect()])
  }

  getPubClient(): RedisClientType {
    return this.pubClient
  }

  getSubClient(): RedisClientType {
    return this.subClient
  }

  async set(key: string, value: string): Promise<void> {
    await this.pubClient.set(key, value)
  }

  async get(key: string): Promise<string> {
    return await this.pubClient.get(key)
  }

  async addClientToUser(clientId: string, userId: string): Promise<void> {
    await this.pubClient.set(`clientToUser:${clientId}`, userId)
  }

  async removeClientToUser(clientId: string): Promise<void> {
    await this.pubClient.del(`clientToUser:${clientId}`)
  }

  async getClientToUser(clientId: string): Promise<string> {
    return await this.pubClient.get(`clientToUser:${clientId}`)
  }

  async addUserToClient(userId: string, clientId: string): Promise<void> {
    await this.pubClient.set(`userToClient:${userId}`, clientId)
  }

  async removeUserToClient(userId: string): Promise<void> {
    await this.pubClient.del(`userToClient:${userId}`)
  }

  async getUserToClient(userId: string): Promise<string> {
    return await this.pubClient.get(`userToClient:${userId}`)
  }

  async addRoomToUser(roomId: string, userId: string): Promise<void> {
    const users = (await this.getRoomToUser(roomId)) || []
    if (!users.includes(userId)) {
      users.push(userId)
      await this.pubClient.set(`roomToUser:${roomId}`, JSON.stringify(users))
    }
  }

  async removeRoomToUser(roomId: string, userId: string): Promise<void> {
    const users = (await this.getRoomToUser(roomId)) || []
    const index = users.indexOf(userId)
    if (index !== -1) {
      users.splice(index, 1)
    }
    if (users.length === 0) {
      // 방에 아무도 없으면 방 삭제
      await this.pubClient.del(`roomToUser:${roomId}`)
    } else {
      // 그렇지 않으면 방에 남은 유저들 저장
      await this.pubClient.set(`roomToUser:${roomId}`, JSON.stringify(users))
    }
  }

  async getRoomToUser(roomId: string): Promise<string[]> {
    const data = await this.pubClient.get(`roomToUser:${roomId}`)
    return data ? JSON.parse(data) : []
  }

  async addUserToRoom(userId: string, roomId: string): Promise<void> {
    const rooms = (await this.getUserToRoom(userId)) || []
    if (!rooms.includes(roomId)) {
      rooms.push(roomId)
      await this.pubClient.set(`userToRoom:${userId}`, JSON.stringify(rooms))
    }
  }

  async removeUserToRoom(userId: string, roomId: string): Promise<void> {
    const rooms = (await this.getUserToRoom(userId)) || []
    const index = rooms.indexOf(roomId)
    if (index !== -1) {
      rooms.splice(index, 1)
    }
    if (rooms.length === 0) {
      // 방이 아무것도 없으면 userToRoom 삭제
      await this.pubClient.del(`userToRoom:${userId}`)
    } else {
      // 그렇지 않으면 userToRoom에 수정된 방 목록 저장
      await this.pubClient.set(`userToRoom:${userId}`, JSON.stringify(rooms))
    }
  }

  async getUserToRoom(userId: string): Promise<string[]> {
    const data = await this.pubClient.get(`userToRoom:${userId}`)
    return data ? JSON.parse(data) : []
  }

  async isExistRoom(
    userId: string,
    receiverId: string,
  ): Promise<string | boolean> {
    const rooms = (await this.getUserToRoom(userId)) || []
    // recevierId가 있는 방이 있으면 roomId반환.
    // 없으면 null 반환.

    for (const roomId of rooms) {
      const users = await this.getRoomToUser(roomId)
      if (users.includes(receiverId) && users.includes(userId)) {
        return roomId
      }
    }
    return false
  }

  async setRoomRecentSeq(roomId: string, seq: number): Promise<void> {
    await this.pubClient.set(`roomRecentSeq:${roomId}`, seq.toString())
  }

  async removeRoomRecentSeq(roomId: string): Promise<void> {
    await this.pubClient.del(`roomRecentSeq:${roomId}`)
  }

  async getRoomRecentSeq(roomId: string): Promise<number> {
    const data = await this.pubClient.get(`roomRecentSeq:${roomId}`)
    return data ? parseInt(data) : 0
  }

  async setUserRecentReadSeq(
    userId: string,
    roomId: string,
    seq: number,
  ): Promise<void> {
    await this.pubClient.set(
      `userRecentReadSeq:${userId}:${roomId}`,
      seq.toString(),
    )
  }

  async removeUserRecentReadSeq(userId: string, roomId: string): Promise<void> {
    await this.pubClient.del(`userRecentReadSeq:${userId}:${roomId}`)
  }

  async getUserRecentReadSeq(userId: string, roomId: string): Promise<number> {
    const data = await this.pubClient.get(
      `userRecentReadSeq:${userId}:${roomId}`,
    )
    return data ? parseInt(data) : 0
  }

  async setRoomRecentMsg(roomId: string, msg: OutMessageDto): Promise<void> {
    await this.pubClient.set(`roomRecentMsg:${roomId}`, JSON.stringify(msg))
  }

  async removeRoomRecentMsg(roomId: string): Promise<void> {
    await this.pubClient.del(`roomRecentMsg:${roomId}`)
  }

  async getRoomRecentMsg(roomId: string): Promise<OutMessageDto> {
    const data = await this.pubClient.get(`roomRecentMsg:${roomId}`)
    return data ? JSON.parse(data) : null
  }

  async createRoom(
    userId: string,
    receiverId: string,
    roomId: string,
  ): Promise<void> {
    await this.addRoomToUser(roomId, userId)
    await this.addRoomToUser(roomId, receiverId)
    await this.addUserToRoom(userId, roomId)
    await this.addUserToRoom(receiverId, roomId)
    await this.setRoomRecentSeq(roomId, 0)
    await this.setUserRecentReadSeq(userId, roomId, 0)
    await this.setUserRecentReadSeq(receiverId, roomId, 0)
  }

  async addMessageRoom(msg: InMessageDto): Promise<OutMessageDto | null> {
    const roomId = msg.roomId
    const roomSeq = await this.getRoomRecentSeq(roomId)
    const roomRecentMsg = await this.getRoomRecentMsg(roomId)
    if (roomRecentMsg && roomRecentMsg.msgId === msg.msgId) {
      return null
    } else {
      const newMsg: OutMessageDto = {
        msgId: msg.msgId,
        msgSeq: roomSeq + 1,
        senderId: msg.senderId,
        receiverId: msg.receiverId,
        roomId: msg.roomId,
        content: msg.content,
        timestamp: Date.now(),
      }
      await this.setRoomRecentSeq(roomId, newMsg.msgSeq)
      await this.setRoomRecentMsg(roomId, newMsg)
      await this.setUserRecentReadSeq(newMsg.senderId, roomId, newMsg.msgSeq)
      return newMsg
    }
  }

  async getChatLobbyStatus(userId: string): Promise<LobbyStatusDto> {
    const rooms = await this.getUserToRoom(userId)
    let totalUnread = 0
    const roomStatus: LobbyRoomStatusDto[] = await Promise.all(
      rooms.map(async (roomId) => {
        const roomRecentMsg = await this.getRoomRecentMsg(roomId)
        const userSeq = await this.getUserRecentReadSeq(userId, roomId)
        let userUnread = 0
        if (roomRecentMsg !== null) userUnread = roomRecentMsg.msgSeq - userSeq
        else userUnread = 0
        totalUnread += userUnread
        return {
          roomId: roomId,
          title: '',
          userUnread: userUnread,
          recentMsg: roomRecentMsg,
        }
      }),
    )
    return {
      userId: userId,
      totalUnread: totalUnread,
      rooms: roomStatus,
    }
  }

  async leaveRoom(userId: string, roomId: string): Promise<boolean> {
    await this.removeRoomToUser(roomId, userId)
    await this.removeUserToRoom(userId, roomId)
    await this.removeUserRecentReadSeq(userId, roomId)
    if ((await this.getRoomToUser(roomId)).length === 0) {
      await this.removeRoomRecentMsg(roomId)
      await this.removeRoomRecentSeq(roomId)
      // 방에 아무도 없으면 방 삭제
      return true
    }
    // 방에 사람 남아있으면 false.
    return false
  }

  async readRoom(
    userId: string,
    roomId: string,
  ): Promise<{ roomSeq: number; clients: string[] }> {
    const roomSeq = await this.getRoomRecentSeq(roomId)
    const userReadSeq = await this.getUserRecentReadSeq(userId, roomId)
    if (roomSeq > userReadSeq) {
      await this.setUserRecentReadSeq(userId, roomId, roomSeq)
      const users = await this.getRoomToUser(roomId)
      const clients = await Promise.all(
        users.map(async (userId) => {
          return await this.getUserToClient(userId)
        }),
      )
      return {
        roomSeq,
        clients,
      }
    } else {
      return {
        roomSeq: null,
        clients: null,
      }
    }
  }
}
