import { promises as fs } from 'fs'
import { Injectable } from '@nestjs/common'
import { CreateProductDto } from './dto/create-product.dto'
import { PrismaService } from '../prisma/prisma.service'
import { join } from 'path'

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

  async getProducts() {
    const products = await this.prismaService.product.findMany()

    return Promise.all(
      products.map(async (product) => ({
        ...product,
        imageExists: await this.imageExists(product.id),
      })),
    )
  }

  private async imageExists(productId: string) {
    try {
      await fs.access(
        join(__dirname, '../../', `public/products/${productId}.jpg`),
        fs.constants.F_OK,
      )
      return true
    } catch (err) {
      return false
    }
  }
}
