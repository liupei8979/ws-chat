import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP')

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request
    const userAgent = request.get('user-agent') || ''

    response.on('finish', () => {
      const { statusCode } = response
      const contentLength = response.get('content-length')

      // 성공일 때만, 로그를 찍는다.
      if (statusCode >= 200 && statusCode < 300)
        this.logger.log(
          `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
        )
    })

    next()
  }
}
