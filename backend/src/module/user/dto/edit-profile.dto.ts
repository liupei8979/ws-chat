import { IsNotEmpty, IsString } from 'class-validator'

export class EditProfileDto {
  @IsString()
  @IsNotEmpty()
  username: string

  @IsString()
  @IsNotEmpty()
  statusMessage: string
}
