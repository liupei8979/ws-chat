import { IsNotEmpty, IsString } from 'class-validator'

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  userId: string

  @IsString()
  @IsNotEmpty()
  receiverId: string

  @IsString()
  @IsNotEmpty()
  roomId: string
}
