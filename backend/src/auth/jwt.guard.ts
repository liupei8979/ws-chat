import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { createApiError } from 'src/utils/api-error.util'

// @
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
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
      if (e.name === 'TokenExpiredError') {
        throw new HttpException(
          createApiError('토큰이 만료되었습니다.', 'Unauthorized'),
          HttpStatus.UNAUTHORIZED,
        )
      }
      throw new HttpException(e, e.status)
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization.split(' ')
    return type === 'Bearer' ? token : undefined
  }
}
