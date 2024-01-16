import { Logger, UseFilters, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
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

@UseFilters(SocketExceptionFilter)
@WebSocketGateway(3030, { namespace: 'chat', cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('ChatGateway')

  @WebSocketServer()
  private server: Server

  constructor(private configService: ConfigService) {}

  afterInit(server: Server): void {
    this.logger.log(`${server} Initialized`)
  }

  async handleConnection(client: Socket): Promise<void> {
    this.logger.log(`Client connected: ${client.id}`)
  }

  async handleDisconnect(client: Socket): Promise<void> {
    this.logger.log(`Client disconnected: ${client.id}`)
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('test')
  async handleChatEvent(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): Promise<void> {
    this.logger.log(`Client ${client.id} sent: ${data}`)
    client.emit('testResponse', data)
  }
}
