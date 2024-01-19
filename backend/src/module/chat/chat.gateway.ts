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
import { WebSocketError, WebSocketResponse } from '@just-chat/types'
import {
  CreateRoomResponseDto,
  createRoomRequestDto,
} from './dto/create-room.dto'
import { InMessageDto } from './dto/in-message.dto'
import { OutMessageDto } from './dto/out-message.dto'
import { SocketException } from 'src/common/socket.exception'
import { JwtService } from '@nestjs/jwt'
import { LobbyStatusDto } from './dto/lobby-status.dto'
import { LeaveRoomRequestDto } from './dto/leave-room.dto'

@UseFilters(SocketExceptionFilter)
@WebSocketGateway(3031, { namespace: 'chat', cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('ChatGateway')

  @WebSocketServer()
  private server: Server

  constructor(
    private chatService: ChatService,
    private jwtService: JwtService,
  ) {}

  afterInit(server: Server): void {
    this.logger.log(`${server} Initialized`)
  }

  // connection하고 disconnection에서는 필터로 에러를 잡을 수가 없음.
  async handleConnection(client: Socket): Promise<void> {
    try {
      const userId = await this.clientToUser(client)

      await this.chatService.connect(client.id, userId)
      const initalChatLobbyStatus =
        await this.chatService.getChatLobbyStatus(userId)
      const response: WebSocketResponse = {
        success: true,
        statusCode: 200,
        payload: initalChatLobbyStatus,
      }
      client.emit('updateChatLobbyStatus', response)
    } catch (e) {
      this.logger.error(e)
      client.emit('Exception', {
        success: false,
        statusCode: 500,
        error: 'InternalServerError',
      })
      await this.chatService.disconnect(
        client.id,
        await this.clientToUser(client),
      )
      client.disconnect()
    }
  }

  async handleDisconnect(client: Socket): Promise<void> {
    try {
      const userId = await this.clientToUser(client)
      await this.chatService.disconnect(client.id, userId)
    } catch (e) {
      this.logger.error(e)
      client.emit('Exception', {
        success: false,
        statusCode: 500,
        error: 'InternalServerError',
      })
      await this.chatService.disconnect(
        client.id,
        await this.clientToUser(client),
      )
      client.disconnect()
    }
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('createRoom')
  async handleCreateRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: createRoomRequestDto,
  ): Promise<void> {
    const { userId, receiverId } = data
    const { roomId, title } = await this.chatService.createRoom(
      userId,
      receiverId,
    )
    const payload: CreateRoomResponseDto = {
      userId: userId,
      receiverId: receiverId,
      roomId: roomId,
      title: title,
    }
    const response: WebSocketResponse = {
      success: true,
      statusCode: 201,
      payload: payload,
    }
    client.emit('createRoomResponse', response)
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: LeaveRoomRequestDto,
  ): Promise<void> {
    const { userId, roomId } = data
    const leaved = await this.chatService.leaveRoom(userId, roomId)
    if (leaved) {
      const response: WebSocketResponse = {
        success: true,
        statusCode: 200,
        payload: { userId: userId, roomId: roomId },
      }
      client.emit('leaveRoomResponse', response)
    } else {
      const response: WebSocketError = {
        success: false,
        statusCode: 400,
        error: 'Bad Request',
        message: '채팅방을 나갈 수 없습니다.',
      }
      client.emit('leaveRoomResponse', response)
    }
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
    const chatLobbyStatus: LobbyStatusDto =
      await this.chatService.getChatLobbyStatus(
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
  @SubscribeMessage('readRoom')
  async readRoom(
    @ConnectedSocket() clinet: Socket,
    @MessageBody() data: LeaveRoomRequestDto,
  ): Promise<void> {
    const { userId, roomId } = data
    const clients = await this.chatService.readRoom(userId, roomId)
    const response: WebSocketResponse = {
      success: true,
      statusCode: 201,
      payload: {
        roomId: roomId,
      },
    }
    clients?.map((clientId) => {
      this.server.to(clientId).emit('readRoomResponse', response)
    })
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

  private async clientToUser(client: Socket): Promise<string> {
    const token = client.handshake.query.accessToken.toString()
    return this.extractUserIdFromQueryToken(client, token)
  }

  // 일단은 Jwt로직 여기다 옮기긴 했음.
  private async extractUserIdFromQueryToken(
    client: Socket,
    token: string,
  ): Promise<string> {
    try {
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
      return userId
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
}
