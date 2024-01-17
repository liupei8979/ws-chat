import { Logger, UseFilters, UseGuards } from '@nestjs/common'
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { JwtAuthGuard } from 'src/auth/jwt.guard'
import { SocketExceptionFilter } from 'src/middlewares/socket.filter'
import { ChatService } from './chat.service'
import { RedisService } from 'src/redis/redis.service'
import { WebSocketResponse } from '@just-chat/types'
import { CreateRoomDto } from './dto/create-room.dto'
import { InMessageDto } from './dto/in-message.dto'
import { OutMessageDto } from './dto/out-message.dto'

@UseFilters(SocketExceptionFilter)
@WebSocketGateway(3030, { namespace: 'chat', cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('ChatGateway')

  @WebSocketServer()
  private server: Server

  constructor(
    private chatService: ChatService,
    private redisService: RedisService,
  ) {}

  afterInit(server: Server): void {
    this.logger.log(`${server} Initialized`)
  }

  async handleConnection(client: Socket): Promise<void> {
    const userId = client.handshake.query.userId.toString()
    await this.chatService.connect(client.id, userId)
    const initalChatLobbyStatus =
      await this.chatService.getChatLobbyStatus(userId)
    const response: WebSocketResponse = {
      success: true,
      statusCode: 200,
      payload: initalChatLobbyStatus,
    }
    client.emit('updateChatLobbyStatus', response)
  }

  async handleDisconnect(client: Socket): Promise<void> {
    const userId = client.handshake.query.userId.toString()
    await this.chatService.disconnect(client.id, userId)
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('createRoom')
  async handleCreateRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): Promise<void> {
    const { userId, receiverId } = data
    const roomId = await this.chatService.createRoom(userId, receiverId)
    const payload: CreateRoomDto = {
      userId: userId,
      receiverId: receiverId,
      roomId: roomId,
    }
    const response: WebSocketResponse = {
      success: true,
      statusCode: 201,
      payload: payload,
    }
    client.emit('createRoomResponse', response)
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: InMessageDto,
  ): Promise<void> {
    const { msgWithSeq, userClientList } =
      await this.chatService.sendMessage(data)

    const payload: OutMessageDto = msgWithSeq
    const response: WebSocketResponse = {
      success: true,
      statusCode: 201,
      payload: payload,
    }

    userClientList.forEach((clientId) => {
      this.server.to(clientId).emit('receiveMessage', response)
    })
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('getChatLobbyStatus')
  async handleRoomStatus(@ConnectedSocket() client: Socket): Promise<void> {
    const chatLobbyStatus = await this.chatService.getChatLobbyStatus(
      client.handshake.query.userId.toString(),
    )
    const response: WebSocketResponse = {
      success: true,
      statusCode: 200,
      payload: chatLobbyStatus,
    }
    client.emit('updateChatLobbyStatus', response)
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('test')
  async handleChatEvent(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): Promise<void> {
    this.logger.log(`Client ${client.id} sent: ${data}`)
    if ('userId' in client) this.logger.log(`Client userId is ${client.userId}`)
    client.emit('testResponse', data)
  }
}
