import { Logger, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets'
import { Server, Socket, Namespace } from 'socket.io'
import { JwtAuthGuard } from 'src/auth/jwt.guard'

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('ChatGateway')
  private chatNamespace: Namespace

  @WebSocketServer()
  private server: Server

  constructor(private configService: ConfigService) {}

  afterInit(server: Server): void {
    const port = this.configService.get<number>('WEBSOCKET_PORT', 3030)
    const namespace = this.configService.get<string>(
      'WEBSOCKET_CHAT_NAMESPACE',
      'chat',
    )
    const corsOrigin = this.configService.get<string>(
      'WEBSOCKET_CORS_ORIGIN',
      '*',
    )

    this.chatNamespace = server.of(namespace)

    server.listen(port, {
      cors: {
        origin: corsOrigin,
        // methods: ['GET', 'POST'],
        // allowedHeaders: ['my-custom-header'],
        // credentials: true
      },
    })

    this.logger.log(
      `WebSocket server running on port ${port} with namespace ${namespace}`,
    )
  }

  @UseGuards(JwtAuthGuard)
  async handleConnection(client: Socket): Promise<void> {
    this.logger.log(`Client connected: ${client.id}`)
  }

  async handleDisconnect(client: Socket): Promise<void> {
    this.logger.log(`Client disconnected: ${client.id}`)
  }
}
