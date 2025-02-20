import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { Prisma, User } from '@prisma/client'
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

  async getUser(filter: Prisma.UserWhereUniqueInput) {
    return this.prismaService.user.findFirstOrThrow({
      where: {
        email: filter.email,
      },
    })
  }
}
