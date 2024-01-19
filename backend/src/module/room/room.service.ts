import { CollectionReference } from '@google-cloud/firestore'
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common'
import { RoomDocument } from 'src/common/document/document.chatroom'
import { createApiError } from 'src/utils/api-error.util'
import { RoomInfoDto } from './dto/room-info.dto'
import { Message } from '@just-chat/types'
import { UserDocument } from 'src/common/document/document.user'

const MESSAGEPERPAGE: number = 100

@Injectable()
export class RoomService {
  private logger = new Logger('RoomService')
  constructor(
    @Inject(RoomDocument.collectionName)
    private roomCollection: CollectionReference<RoomDocument>,
    @Inject(UserDocument.collectionName)
    private usersCollection: CollectionReference<UserDocument>,
  ) {}

  async getRoomInfo(
    userId: string,
    roomId: string,
    pagination: number,
  ): Promise<RoomInfoDto> {
    this.logger.log(`getRoomInfo: ${roomId}`)
    const roomRef = this.roomCollection.doc(roomId)
    const roomSnapshot = await roomRef.get()
    if (!roomSnapshot.exists) {
      throw new HttpException(
        createApiError('해당 채팅방이 존재하지 않습니다.', 'Not Found'),
        HttpStatus.NOT_FOUND,
      )
    }

    const recentSeq = roomSnapshot.data()?.recentMsgSeq
    const endSeq = recentSeq - MESSAGEPERPAGE * pagination
    let startSeq = endSeq - MESSAGEPERPAGE + 1
    if (startSeq < 0) {
      startSeq = 0
    }

    const query = this.roomCollection
      .doc(roomId)
      .collection('messages')
      .orderBy('msgSeq', 'desc')
      .startAt(endSeq)
      .endBefore(startSeq)
      .limit(MESSAGEPERPAGE)

    const messages = await query.get()
    const messagesData: Message[] = messages.docs.map((doc) => {
      const data = doc.data()
      return {
        msgId: data.msgId,
        msgSeq: data.msgSeq,
        senderId: data.senderId,
        receiverId: data.receiverId,
        content: data.content,
        timestamp: data.timestamp,
        roomId: data.roomId,
      }
    })

    const memberIds = roomSnapshot.data()?.members || []
    const memberName = await Promise.all(
      memberIds.map(async (memberId: string) => {
        const userSnapshot = await this.usersCollection.doc(memberId).get()
        return userSnapshot.exists ? userSnapshot.data()?.username : 'Unknown'
      }),
    )

    const membersWithNames = memberIds.map((memberId, index) => ({
      userId: memberId,
      username: memberName[index],
    }))

    const receiverId = membersWithNames.find(
      (member) => member.userId !== userId,
    )?.userId

    const userDoc = await this.usersCollection.doc(userId).get()
    const isFriend = userDoc?.data().friends.includes(receiverId)
    // this.logger.log(isFriend);

    const result: RoomInfoDto = {
      roomId: roomSnapshot.data()?.roomId,
      title: roomSnapshot.data()?.title,
      members: membersWithNames,
      recentMsgSeq: recentSeq,
      messages: messagesData,
      recentUserRead: roomSnapshot.data()?.recentUserRead,
      isFriend: isFriend,
    }

    return result
  }
}
