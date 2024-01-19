import { User } from '@just-chat/types'
import { IsNumber, IsString } from 'class-validator'

export class UserDocument implements User {
  static collectionName = 'users'

  @IsString()
  email: string

  @IsString()
  username: string

  @IsNumber()
  password: string

  @IsString()
  statusMessage: string

  @IsString({ each: true })
  friends: string[]
}
