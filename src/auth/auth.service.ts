import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.usersService.getUser({ email })
      const authenticated = await bcrypt.compare(password, user.password)
      if (!authenticated) {
        throw new UnauthorizedException()
      }

      return user
    } catch (err) {
      throw new UnauthorizedException('Invalid credentials')
    }
  }
}
