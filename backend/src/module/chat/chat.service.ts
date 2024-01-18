import { CollectionReference } from '@google-cloud/firestore'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { RoomDocument } from 'src/common/document/document.chatroom'
import { UserDocument } from 'src/common/document/document.user'
import { SocketException } from 'src/common/socket.exception'
import { RedisService } from 'src/module/redis/redis.service'
import { v4 as uuidv4 } from 'uuid'
import { InMessageDto } from './dto/in-message.dto'
import { OutMessageDto } from './dto/out-message.dto'
import { LobbyStatusDto } from './dto/lobby-status.dto'

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
    this.logger.log(`Client ${clientId} connected`)
  }

  async disconnect(clientId: string, userId: string): Promise<void> {
    await this.redisService.removeClientToUser(clientId)
    await this.redisService.removeUserToClient(userId)
    this.logger.log(`Client ${clientId} disconnected`)
  }

  async createRoom(
    userId: string,
    receiverId: string,
  ): Promise<{ roomId: string; title: string }> {
    const isExistRoom = await this.redisService.isExistRoom(userId, receiverId)
    let roomId
    if (isExistRoom === false) {
      // 없으면 새로운 방 생성
      roomId = uuidv4()
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

    const title = (await this.usersCollection.doc(receiverId).get())?.data()
      .username

    this.logger.log(`Room ${roomId} created`)
    return {
      roomId,
      title: title,
    }
  }

  async leaveRoom(userId: string, roomId: string): Promise<boolean> {
    const isEmpty = await this.redisService.leaveRoom(userId, roomId)
    if (isEmpty) {
      // 채팅방 지우기 전에 하위 메시지 doc 전부 삭제 후 메시지 지우기
      const messagesRef = this.roomCollection.doc(roomId).collection('messages')
      const messagesSnapshot = await messagesRef.get()
      await Promise.all(messagesSnapshot.docs.map((doc) => doc.ref.delete()))
      await this.roomCollection.doc(roomId).delete()
    }
    this.logger.log(`User ${userId} leave room ${roomId}`)
    return true
  }

  async readRoom(userId: string, roomId: string): Promise<string[]> {
    const { roomSeq, clients } = await this.redisService.readRoom(
      userId,
      roomId,
    )
    if (roomSeq) {
      const roomRef = this.roomCollection.doc(roomId)
      const roomDoc = await roomRef.get()
      const recentUserRead = roomDoc.data()?.recentUserRead || {}
      recentUserRead[userId] = roomSeq
      await roomRef.update({
        recentUserRead: recentUserRead,
      })
      return clients
    } else {
      return null
    }
  }

  async sendMessage(
    data: InMessageDto,
  ): Promise<{ msgWithSeq: OutMessageDto; userClientList: string[] }> {
    //redis 작업
    const newMessage = await this.redisService.addMessageRoom(data)
    if (!newMessage) {
      throw new SocketException('BadRequest', '메시지가 중복 전송', 400)
    }

    //DB 작업
    const roomRef = this.roomCollection.doc(data.roomId)
    const roomDoc = await roomRef.get()
    const recentUserRead = roomDoc.data()?.recentUserRead || {}

    recentUserRead[data.senderId] = newMessage.msgSeq

    await roomRef.update({
      recentMsgSeq: newMessage.msgSeq,
      recentUserRead: recentUserRead,
    })

    await this.roomCollection
      .doc(data.roomId)
      .collection('messages')
      .doc(data.msgId)
      .set(newMessage)

    const currentUsers = await this.redisService.getRoomToUser(data.roomId)
    const result = await Promise.all(
      currentUsers.map(async (userId) => {
        return await this.redisService.getUserToClient(userId)
      }),
    )

    this.logger.log(`Message ${data.msgId} sent to room ${data.roomId}`)
    return {
      msgWithSeq: newMessage,
      userClientList: result,
    }
  }

  async getChatLobbyStatus(userId: string): Promise<LobbyStatusDto> {
    const lobbyStatus = await this.redisService.getChatLobbyStatus(userId)

    // db에서 title 조회해서 있으면 해당 title(단체톡), 없으면 상대방 이름전달.
    lobbyStatus.rooms
    this.roomCollection.doc()

    for (const room of lobbyStatus.rooms) {
      const roomDocRef = this.roomCollection.doc(room.roomId)
      const roomDoc = await roomDocRef.get()

      if (roomDoc.exists) {
        const roomData = roomDoc.data()
        if (roomData && roomData.title) {
          room.title = roomData.title
        } else {
          const otherMemberId = roomData.members.find(
            (memberId) => memberId !== userId,
          )
          room.title = (
            await this.usersCollection.doc(otherMemberId).get()
          ).data()?.username
        }
      }
    }

    return lobbyStatus
  }
}
