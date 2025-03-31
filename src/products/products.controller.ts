import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CreateProductDto } from './dto/create-product.dto'
import { CurrentUser } from '../auth/current-user.decorator'
import { TokenPayload } from '../auth/token-payload.interface'
import { ProductsService } from './products.service'

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.productsService.createProduct(createProductDto, user.userId)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getProducts() {
    return this.productsService.getProducts()
  }
}
