import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Patch,
  Post,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common'
import { HttpExceptionFilter } from 'src/utils/filter/http.exception.filter'
import { UserService } from './user.service'
import { ApiResponse } from '@just-chat/types'
import { JwtAuthGuard } from 'src/module/auth/jwt.guard'
import { UserMainDto } from './dto/user-main.dto'
import { AddFriendDto } from './dto/add-friend.dto'
import { EditProfileDto } from './dto/edit-profile.dto'

@UseFilters(HttpExceptionFilter)
@Controller('user')
export class UserController {
  private logger = new Logger('UserController')

  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/main')
  async getMain(@Req() req, @Res() res) {
    this.logger.log(`getProfile: ${req.user.email}`)

    const userMain = await this.userService.getMain(req.user.email)

    const response: ApiResponse<UserMainDto> = {
      success: true,
      statusCode: HttpStatus.OK,
      message: '프로필 조회에 성공하였습니다.',
      data: userMain,
    }

    res.status(response.statusCode).json(response)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/profile')
  async updateProfile(
    @Req() req,
    @Res() res,
    @Body() editProfileDto: EditProfileDto,
  ) {
    this.logger.log(`updateProfile: ${req.user.email}`)

    await this.userService.updateProfile(req.user.email, editProfileDto)

    const response: ApiResponse<string> = {
      success: true,
      statusCode: HttpStatus.OK,
      message: '프로필 수정에 성공하였습니다.',
    }

    res.status(response.statusCode).json(response)
  }

  @UseGuards(JwtAuthGuard)
  @Post('/friend')
  async addFriend(@Req() req, @Res() res, @Body() addFreindDto: AddFriendDto) {
    this.logger.log(`addFriend: ${req.user.email}`)

    await this.userService.addFriend(req.user.email, addFreindDto.email)

    const response: ApiResponse<string> = {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: '친구 추가에 성공하였습니다.',
    }

    res.status(response.statusCode).json(response)
  }
}
