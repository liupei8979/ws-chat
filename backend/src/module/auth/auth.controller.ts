import {
  Body,
  Controller,
  HttpStatus,
  Logger,
  Post,
  Req,
  Res,
  UseFilters,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { SignUpDto } from './dto/sign-up.dto'
import { ApiResponse } from '@just-chat/types'
import { HttpExceptionFilter } from 'src/utils/filter/http.exception.filter'
import { SignInDto } from './dto/\bsign-in.dto'

@UseFilters(HttpExceptionFilter)
@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController')

  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Req() req, @Res() res, @Body() signUpDto: SignUpDto) {
    this.logger.log(`creatingUser: ${signUpDto.email}`)

    await this.authService.signUp(signUpDto)

    const response: ApiResponse<string> = {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: '회원가입에 성공하였습니다.',
    }

    res.status(response.statusCode).json(response)
  }

  @Post('/signin')
  async signIn(@Req() req, @Res() res, @Body() signInDto: SignInDto) {
    this.logger.log(`signIn: ${signInDto.email}`)

    const accessToken = await this.authService.signIn(signInDto)

    const response: ApiResponse<{ accessToken: string }> = {
      success: true,
      statusCode: HttpStatus.OK,
      message: '로그인에 성공하였습니다.',
      data: accessToken,
    }

    res.status(response.statusCode).json(response)
  }
}
