import { promises as fs } from 'fs'
import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateProductDto } from './dto/create-product.dto'
import { PrismaService } from '../prisma/prisma.service'
import { join } from 'path'
import { PRODUCT_IMAGES } from './product-images'
import { Prisma } from '@prisma/client'
import { ProductsGateway } from './products.gateway'

@Injectable()
export class ProductsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productsGateway: ProductsGateway,
  ) {}

  async createProduct(createProductDto: CreateProductDto, userId: string) {
    const product = await this.prismaService.product.create({
      data: {
        ...createProductDto,
        userId,
      },
    })

    this.productsGateway.handleProductUpdated()

    return product
  }

  async getProducts(status?: string) {
    const args: Prisma.ProductFindManyArgs = {}
    if (status === 'available') {
      args.where = { sold: false }
    }

    const products = await this.prismaService.product.findMany(args)

    return Promise.all(
      products.map(async (product) => ({
        ...product,
        imageExists: await this.imageExists(product.id),
      })),
    )
  }

  async getProduct(productId: string) {
    try {
      return {
        ...(await this.prismaService.product.findUniqueOrThrow({
          where: {
            id: productId,
          },
        })),
        imageExists: await this.imageExists(productId),
      }
    } catch (err) {
      throw new NotFoundException(`Product with id ${productId} not found`)
    }
  }

  async update(productId: string, data: Prisma.ProductUpdateInput) {
    await this.prismaService.product.update({
      where: { id: productId },
      data,
    })

    this.productsGateway.handleProductUpdated()
  }

  private async imageExists(productId: string) {
    try {
      await fs.access(
        join(`${PRODUCT_IMAGES}/${productId}.jpg`),
        fs.constants.F_OK,
      )
      return true
    } catch (err) {
      return false
    }
  }
}
