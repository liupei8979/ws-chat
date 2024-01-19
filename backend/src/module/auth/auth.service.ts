import { CollectionReference } from '@google-cloud/firestore'
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserDocument } from 'src/common/document/document.user'
import { SignInDto } from './dto/\bsign-in.dto'
import { SignUpDto } from './dto/sign-up.dto'
import { createApiError } from 'src/utils/api-error.util'
import { RedisService } from '../redis/redis.service'

@Injectable()
export class AuthService {
  private logger: Logger = new Logger('AuthService')

  constructor(
    @Inject(UserDocument.collectionName)
    private usersCollection: CollectionReference<UserDocument>,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
    const { email, password } = signInDto

    if (await this.redisService.getUserToClient(email)) {
      throw new HttpException(
        createApiError('이미 로그인되어 있습니다.', 'BadRequest'),
        HttpStatus.BAD_REQUEST,
      )
    }

    const userSnapshot = await this.usersCollection
      .where('email', '==', email)
      .where('password', '==', password)
      .get()

    if (userSnapshot.empty) {
      throw new HttpException(
        createApiError(
          '이메일 또는 비밀번호가 일치하지 않습니다.',
          'Unauthorized',
        ),
        HttpStatus.UNAUTHORIZED,
      )
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
      throw new HttpException(
        createApiError('이미 존재하는 이메일입니다.', 'Conflict'),
        HttpStatus.CONFLICT,
      )
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
