import {
  Body,
  Controller,
  HttpStatus,
  Logger,
  Post,
  Req,
  Res,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { SignUpDto } from './dto/sign-up.dto'

@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController')

  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Req() req, @Res() res, @Body() signUpDto: SignUpDto) {
    this.logger.log(`creatingUser: ${signUpDto.email}`)
    const result = await this.authService.signUp(signUpDto)
    if (result) {
      res.status(HttpStatus.CREATED).send()
    } else {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send()
    }
  }

  @Post('/signin')
  async signIn(@Req() req, @Res() res, @Body() signUpDto: SignUpDto) {
    this.logger.log(`signIn: ${signUpDto.email}`)
    const result = await this.authService.signIn(signUpDto)
    if (result) {
      res.status(HttpStatus.OK).json(result)
    } else {
      res.status(HttpStatus.NOT_ACCEPTABLE).send()
    }
  }
}
