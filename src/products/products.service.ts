import { Injectable } from '@nestjs/common'
import { CreateProductDto } from './dto/create-product.dto'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createProduct(createProductDto: CreateProductDto, userId: string) {
    return this.prismaService.product.create({
      data: {
        ...createProductDto,
        userId,
      },
    })
  }
}
