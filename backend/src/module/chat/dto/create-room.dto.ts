import { IsNotEmpty, IsString } from 'class-validator'

export class createRoomRequestDto {
  @IsString()
  @IsNotEmpty()
  userId: string

  @IsString()
  @IsNotEmpty()
  receiverId: string
}

export class CreateRoomResponseDto {
  @IsString()
  @IsNotEmpty()
  userId: string

  @IsString()
  @IsNotEmpty()
  receiverId: string

  @IsString()
  @IsNotEmpty()
  roomId: string

  @IsString()
  @IsNotEmpty()
  title: string
}
