import { ApiError } from '@just-chat/types'
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'

// @
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)
    if (!token) {
      // should fix Exception.
      const error: ApiError = {
        success: false,
        statusCode: 401,
        message: '토큰이 존재하지 않습니다.',
        error: 'Unauthorized',
      }
      throw new HttpException(error, error.statusCode)
    }

    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    })
    if (!payload) {
      const error: ApiError = {
        success: false,
        statusCode: 401,
        message: '토큰이 유효하지 않습니다.',
        error: 'Unauthorized',
      }
      throw new HttpException(error, error.statusCode)
    }
    const { email } = payload
    request['user'] = { email: email }

    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization.split(' ')
    return type === 'Bearer' ? token : undefined
  }
}
