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
import { JwtAuthGuard } from 'src/module/auth/jwt.guard'
import { SocketExceptionFilter } from 'src/utils/filter/socket.exception.filter'
import { ChatService } from './chat.service'
import { RedisService } from 'src/module/redis/redis.service'
import { WebSocketResponse } from '@just-chat/types'
import { CreateRoomDto } from './dto/create-room.dto'
import { InMessageDto } from './dto/in-message.dto'
import { OutMessageDto } from './dto/out-message.dto'
import { SocketException } from 'src/common/socket.exception'
import { JwtService } from '@nestjs/jwt'

@UseFilters(SocketExceptionFilter)
@WebSocketGateway(3030, { namespace: 'chat', cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('ChatGateway')

  @WebSocketServer()
  private server: Server

  constructor(
    private chatService: ChatService,
    private redisService: RedisService,
    private jwtService: JwtService,
  ) {}

  afterInit(server: Server): void {
    this.logger.log(`${server} Initialized`)
  }

  // handdleConnection, handleDisconnect token 로직 옮기기.
  async handleConnection(client: Socket): Promise<void> {
    try {
      const token = client.handshake.query.accessToken.toString()
      const [type, tokenValue] = token.split(' ')
      if (type !== 'Bearer') {
        throw new SocketException(
          'Unauthorized',
          '토큰 타입이 올바르지 않습니다.',
          401,
        )
      }
      const decoded = await this.jwtService.verifyAsync(tokenValue)

      const userId = decoded['email']

      await this.chatService.connect(client.id, userId)
      const initalChatLobbyStatus =
        await this.chatService.getChatLobbyStatus(userId)
      const response: WebSocketResponse = {
        success: true,
        statusCode: 200,
        payload: initalChatLobbyStatus,
      }
      client.emit('updateChatLobbyStatus', response)
    } catch (error) {
      this.logger.error(error)
      client.emit('Exception', {
        success: false,
        statusCode: 401,
        error: error.status,
        message: error.message,
      })
      client.disconnect()
    }
  }

  async handleDisconnect(client: Socket): Promise<void> {
    const token = client.handshake.query.accessToken.toString()
    const [type, tokenValue] = token.split(' ')
    if (type !== 'Bearer') {
      throw new SocketException(
        'Unauthorized',
        '토큰 타입이 올바르지 않습니다.',
        401,
      )
    }
    const decoded = await this.jwtService.verifyAsync(tokenValue)

    const userId = decoded['userId']
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
