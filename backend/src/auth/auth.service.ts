import { CollectionReference } from '@google-cloud/firestore'
import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserDocument } from 'src/firestore/document/document.user'
import { AuthCredentialsDto } from './dto/auth-credentials.dto'
import { SignUpDto } from './dto/sign-up.dto'

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
      throw new UnauthorizedException()
    } else {
      const userDoc = userSnapshot.docs[0]
      const payload = {
        email: userDoc.data().email,
        password: userDoc.data().password,
      }
      return {
        accessToken: await this.jwtService.signAsync(payload),
      }
    }
  }

  async signUp(signUpDto: SignUpDto): Promise<boolean> {
    const { email, password, username } = signUpDto
    try {
      const docRef = this.usersCollection.doc(email)
      const userSnapshot = await docRef.get()
      if (userSnapshot.exists) {
        throw new Error('이미 존재하는 이메일입니다.')
      }

      await docRef.set({
        email: email,
        password: password,
        username: username,
        friends: [],
        statusMessage: '',
      })

      return true
    } catch (e) {
      this.logger.error(e)
      return false
    }
  }
}
