import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common'
import { Response } from 'express'
import { ApiError } from '@just-chat/types'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger('HTTP-Exception')
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus()
    const err = exception.getResponse() as
      | { message: any; statusCode: number; error: string }
      | { message: string[]; statusCode: 400; error: string[] }

    const errorResponse: ApiError = {
      success: false,
      statusCode: status,
      message: err.message,
      error: err.error,
    }

    this.logger.error(
      `${status} ${errorResponse.error} ${errorResponse.message}`,
    )
    this.logger.log(exception.stack)

    if (typeof err !== 'string' && err.statusCode === 400) {
      // class-validator 에러
      return response.status(status).json(errorResponse)
    }
    response.status(status).json(errorResponse)
  }
}
