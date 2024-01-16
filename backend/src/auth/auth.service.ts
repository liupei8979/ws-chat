import { CollectionReference } from '@google-cloud/firestore'
import { HttpException, Inject, Injectable, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserDocument } from 'src/firestore/document/document.user'
import { AuthCredentialsDto } from './dto/auth-credentials.dto'
import { SignUpDto } from './dto/sign-up.dto'
import { ApiError } from '@just-chat/types'

@Injectable()
export class AuthService {
  private logger: Logger = new Logger('AuthService')

  constructor(
    @Inject(UserDocument.collectionName)
    private usersCollection: CollectionReference<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { email, password } = authCredentialsDto

    const userSnapshot = await this.usersCollection
      .where('email', '==', email)
      .where('password', '==', password)
      .get()

    if (userSnapshot.empty) {
      // should fix Exception.
      const error: ApiError = {
        success: false,
        statusCode: 401,
        message: '이메일 또는 비밀번호가 일치하지 않습니다.',
        error: 'Unauthorized',
      }
      throw new HttpException(error, error.statusCode)
    }

    const userDoc = userSnapshot.docs[0]
    const payload = {
      email: userDoc.data().email,
      password: userDoc.data().password,
    }

    return {
      accessToken: await this.jwtService.signAsync(payload),
    }
  }

  async signUp(signUpDto: SignUpDto): Promise<void> {
    const { email, password, username } = signUpDto

    const docRef = this.usersCollection.doc(email)
    const userSnapshot = await docRef.get()

    if (userSnapshot.exists) {
      const error: ApiError = {
        success: false,
        statusCode: 409,
        message: '이미 존재하는 이메일입니다.',
        error: 'Conflict',
      }
      throw new HttpException(error, error.statusCode)
    }

    await docRef.set({
      email: email,
      password: password,
      username: username,
      friends: [],
      statusMessage: '',
    })

    return
  }
}
