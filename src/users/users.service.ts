import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { User } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      return await this.prismaService.user.create({
        data: {
          ...createUserDto,
          password: await bcrypt.hash(createUserDto.password, 10),
        },
        select: {
          id: true,
          email: true,
        },
      })
    } catch (err) {
      if (err.code === 'P2002') {
        throw new UnprocessableEntityException('Email already exists')
      }

      throw err
    }
  }
}
