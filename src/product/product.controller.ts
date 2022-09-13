import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ProductInterface } from "../common/models/product.model";
import { AuthGuard } from "../guards/auth.guard";
import { CreateProductDto } from "./dto/createProduct.dto";
import { UpdateProductDto } from "./dto/updateProduct.dto";

import { ProductService } from "./product.service";

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  public async findProducts(): Promise<ProductInterface[]> {
    return await this.productService.findProducts();
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  public async createProduct(
    @Body('product') productCreateDto: CreateProductDto,
  ) {
    return await this.productService.createProduct(productCreateDto);
  }

  @Put(':productId')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  public async updateProduct(
    @Body('product') productUpdateDto: UpdateProductDto,
    @Param('productId') productId: string,
  ): Promise<ProductInterface> {
    return await this.productService.updateProduct(productUpdateDto, productId);
  }

  @Delete(':productId')
  @UseGuards(AuthGuard)
  public async deleteProduct(@Param('productId') productId: string) {
    return await this.productService.deleteProduct(productId);
  }
}
