import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common'
import { UserMainDto } from './dto/user-main.dto'
import { UserDocument } from 'src/common/document/document.user'
import { CollectionReference } from '@google-cloud/firestore'
import { createApiError } from 'src/utils/api-error.util'
import { EditProfileDto } from './dto/edit-profile.dto'

@Injectable()
export class UserService {
  private logger: Logger = new Logger('UserService')

  constructor(
    @Inject(UserDocument.collectionName)
    private usersCollection: CollectionReference<UserDocument>,
  ) {}

  async getMain(email: string): Promise<UserMainDto> {
    const docRef = this.usersCollection.doc(email)
    const userSnapshot = await docRef.get()

    if (!userSnapshot.exists) {
      throw new HttpException(
        createApiError('해당 유저가 존재하지 않습니다.', 'Not Found'),
        HttpStatus.NOT_FOUND,
      )
    }

    const userDoc = userSnapshot.data()

    const result = {
      email: userDoc.email,
      username: userDoc.username,
      statusMessage: userDoc.statusMessage,
      friends: [],
    }

    const friends = userDoc.friends || []
    if (friends.length > 0) {
      const friendsInfo = await Promise.all(
        friends.map(async (friendEmail: string) => {
          const friendDoc = await this.usersCollection.doc(friendEmail).get()
          if (!friendDoc.exists) {
            return
          }
          const userData = friendDoc.data()
          const { email, username, statusMessage } = userData
          return { email, username, statusMessage }
        }),
      )
      result.friends = friendsInfo.filter((friend) => friend !== null)
    }

    return result
  }

  async addFriend(email: string, friendEmail: string): Promise<void> {
    if (email === friendEmail) {
      throw new HttpException(
        createApiError('자기 자신을 친구로 등록할 수 없습니다.', 'Forbidden'),
        HttpStatus.FORBIDDEN,
      )
    }

    const docRef = this.usersCollection.doc(email)
    const userSnapshot = await docRef.get()
    const docRef2 = this.usersCollection.doc(friendEmail)
    const friendSnapshot = await docRef2.get()

    if (!userSnapshot.exists || !friendSnapshot.exists) {
      throw new HttpException(
        createApiError('해당 유저가 존재하지 않습니다.', 'Not Found'),
        HttpStatus.NOT_FOUND,
      )
    }

    const userDoc = userSnapshot.data()
    const friends = userDoc.friends
    if (friends.includes(friendEmail)) {
      throw new HttpException(
        createApiError('이미 친구로 등록된 유저입니다.', 'Conflict'),
        HttpStatus.CONFLICT,
      )
    }

    friends.push(friendEmail)
    await docRef.update({ friends })
  }

  async updateProfile(
    email: string,
    editProfileDto: EditProfileDto,
  ): Promise<void> {
    const { username, statusMessage } = editProfileDto

    const docRef = this.usersCollection.doc(email)
    const userSnapshot = await docRef.get()

    if (!userSnapshot.exists) {
      throw new HttpException(
        createApiError('해당 유저가 존재하지 않습니다.', 'Not Found'),
        HttpStatus.NOT_FOUND,
      )
    }

    await docRef.update({ username, statusMessage })
  }
}
