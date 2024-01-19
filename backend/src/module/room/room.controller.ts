import {
  Controller,
  Get,
  Logger,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { RoomService } from './room.service'
import { JwtAuthGuard } from '../auth/jwt.guard'
import { ApiResponse } from '@just-chat/types'
import { RoomInfoDto } from './dto/room-info.dto'

@Controller('room')
export class RoomController {
  private logger = new Logger('RoomController')
  constructor(private readonly roomService: RoomService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/:roomId')
  async getRoomInfo(@Req() req, @Res() res, @Query() data: any) {
    let { page } = data
    const userId = req.user.email
    if (!page) page = 0
    const roomInfo = await this.roomService.getRoomInfo(
      userId,
      req.params.roomId,
      page,
    )
    const response: ApiResponse<RoomInfoDto> = {
      success: true,
      statusCode: 200,
      message: '방 조회 성공',
      data: roomInfo,
    }
    res.status(response.statusCode).json(response)
  }
}
