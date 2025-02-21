import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import * as bcrypt from 'bcryptjs'
import { User } from '@prisma/client'
import { Response } from 'express'
import ms from 'ms'
import { ConfigService } from '@nestjs/config'
import { TokenPayload } from './token-payload.interface'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login(user: User, response: Response) {
    const expires = new Date()
    expires.setMilliseconds(
      expires.getMilliseconds() +
        Number(ms(this.configService.getOrThrow('JWT_EXPIRATION_TIME'))),
    )

    const tokenPayload: TokenPayload = {
      userId: user.id,
    }

    const token = this.jwtService.sign(tokenPayload)

    response.cookie('Authentication', token, {
      expires,
      httpOnly: true,
      secure: true,
    })

    return { tokenPayload }
  }

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
