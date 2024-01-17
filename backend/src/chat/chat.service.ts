import { CollectionReference } from '@google-cloud/firestore'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { RoomDocument } from 'src/firestore/document/document.chatroom'
import { UserDocument } from 'src/firestore/document/document.user'
import { RedisService } from 'src/redis/redis.service'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class ChatService {
  private logger: Logger = new Logger('ChatService')
  constructor(
    @Inject(UserDocument.collectionName)
    private usersCollection: CollectionReference<UserDocument>,
    @Inject(RoomDocument.collectionName)
    private roomCollection: CollectionReference<RoomDocument>,
    private redisService: RedisService,
  ) {}

  async connect(clientId: string, userId: string): Promise<void> {
    await this.redisService.addClientToUser(clientId, userId)
    await this.redisService.addUserToClient(userId, clientId)
  }

  async disconnect(clientId: string, userId: string): Promise<void> {
    await this.redisService.removeClientToUser(clientId)
    await this.redisService.removeUserToClient(userId)
  }

  async createRoom(userId: string, receiverId: string): Promise<string> {
    const isExistRoom = await this.redisService.isExistRoom(userId, receiverId)
    let roomId
    if (isExistRoom === false) {
      // 없으면 새로운 방 생성
      const roomId = uuidv4()
      await this.redisService.createRoom(userId, receiverId, roomId)
      // DB에도 생성
      await this.roomCollection.doc(roomId).set({
        roomId: roomId,
        title: '',
        members: [userId, receiverId],
        recentMsgSeq: 0,
        recentUserRead: {
          [userId]: 0,
          [receiverId]: 0,
        },
      })
    } else {
      // 있으면 기존 방 번호 return
      roomId = isExistRoom
    }

    return roomId
  }
}
