import { BaseWsExceptionFilter } from '@nestjs/websockets'
import { SocketException } from './socket.exception'
import { ArgumentsHost, Catch, Logger } from '@nestjs/common'
import { Socket } from 'socket.io'

@Catch(SocketException)
export class SocketExceptionFilter extends BaseWsExceptionFilter {
  private logger: Logger = new Logger('Socket-Exception')
  catch(exception: SocketException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<Socket>()
    const status = exception.getError()['status'] || 'InternalServerError'
    const message = exception.getError()['message'] || 'Internal Server Error'

    // 클라이언트에 에러 메시지 전송

    this.logger.log(`Client-id: ${client.id} - ${status} - ${message}`)
    client.emit('Exception', {
      success: false,
      error: status,
      message,
    })

    client.disconnect()
  }
}
