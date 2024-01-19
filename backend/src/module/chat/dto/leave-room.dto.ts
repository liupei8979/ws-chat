import { IsNotEmpty, IsString } from 'class-validator'

export class LeaveRoomRequestDto {
  @IsString()
  @IsNotEmpty()
  userId: string

  @IsString()
  @IsNotEmpty()
  roomId: string
}
