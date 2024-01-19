import { User } from '@just-chat/types'
import { IsString } from 'class-validator'

export class UserMainDto implements Omit<User, 'password'> {
  @IsString()
  email: string

  @IsString()
  username: string

  @IsString()
  statusMessage: string

  // 유효성 검사
  friends: string[]
}
