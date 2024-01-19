import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { SocketException } from 'src/common/socket.exception'
import { createApiError } from 'src/utils/api-error.util'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private logger: Logger = new Logger('JwtAuthGuard')
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const contextType = context.getType()
    if (contextType === 'http') {
      return this.validateHttpRequest(context)
    } else if (contextType === 'ws') {
      return this.validateWebSocketRequest(context)
    } else {
      throw new HttpException(
        createApiError('Unsupported context type', 'Forbidden'),
        HttpStatus.FORBIDDEN,
      )
    }
  }

  private async validateHttpRequest(
    context: ExecutionContext,
  ): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest()
      const token = this.extractTokenFromHeader(request)
      if (!token) {
        throw new HttpException(
          createApiError('토큰이 존재하지 않습니다.', 'Unauthorized'),
          HttpStatus.UNAUTHORIZED,
        )
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      })

      if (!payload) {
        throw new HttpException(
          createApiError('토큰이 유효하지 않습니다.', 'Unauthorized'),
          HttpStatus.UNAUTHORIZED,
        )
      }
      const { email } = payload
      request['user'] = { email: email }

      return true
    } catch (e) {
      if (e.name) {
        throw new HttpException(
          createApiError(e.error, e.name),
          HttpStatus.INTERNAL_SERVER_ERROR,
        )
      }
      throw new HttpException(e, e.status)
    }
  }

  private async validateWebSocketRequest(
    context: ExecutionContext,
  ): Promise<boolean> {
    const client = context.switchToWs().getClient()
    const query = client.handshake.query.accessToken
    const token = this.extractTokenFromQuery(query)

    if (!token) {
      // 수정해야함.
      throw new SocketException(
        'Unauthorized',
        '토큰이 존재하지 않습니다.',
        401,
      )
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      })
      if (!payload) {
        throw new SocketException(
          'Unauthorized',
          '토큰이 유효하지 않습니다.',
          401,
        )
      }
      const { email } = payload
      client['userId'] = email
    } catch (e) {
      if (e.name) {
        throw new SocketException('Unauthorized', e.name, 401)
      }
      throw new SocketException(
        'Unauthorized',
        '토큰이 유효하지 않습니다.',
        401,
      )
    }
    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization.split(' ')
    return type === 'Bearer' ? token : undefined
  }

  private extractTokenFromQuery(query: string): string | undefined {
    const [type, token] = query.split(' ')
    return type === 'Bearer' ? token : undefined
  }
}
