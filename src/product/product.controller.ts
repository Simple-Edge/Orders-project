import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { User } from "../common/decorators/user.decorator";
import { ProductInterface } from "../common/models/product.model";
import { AuthGuard } from "../guards/auth.guard";
import { CommentDto } from "./dto/create-update-comment.dto";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

import { ProductService } from "./product.service";
import { RoleGuard } from "../guards/role.guard";
import { ProductResponseInterface } from "src/common/interfaces/product-responce.interface";

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Get()
  public async findProducts(
    @Query()
    query: any
  ): Promise<ProductInterface[]> {
    return await this.productService.findProducts(query);
  }

  @Get(':productId')
  public async findProduct(
    @Param('productId') productId: string,
  ): Promise<ProductResponseInterface> {
    const product = await this.productService.findProductById(productId);
    return await this.productService.buildProductResponse(product)
  }

  @Post()
  @UseGuards(new RoleGuard(['fullAcces', 'productFullAcces', 'productWrite']))
  @UsePipes(new ValidationPipe())
  public async createProduct(
    @Body('product') productCreateDto: CreateProductDto,
  ) {
    return await this.productService.createProduct(productCreateDto);
  }

  @Put(':productId')
  @UseGuards(new RoleGuard(['fullAcces', 'productFullAcces', 'productWrite']))
  @UsePipes(new ValidationPipe())
  public async updateProduct(
    @Body('product') productUpdateDto: UpdateProductDto,
    @Param('productId') productId: string,
  ): Promise<ProductInterface> {
    return await this.productService.updateProduct(productUpdateDto, productId);
  }

  @Delete(':productId')
  @UseGuards(new RoleGuard(['fullAcces', 'productFullAcces', 'productDelete']))
  public async deleteProduct(@Param('productId') productId: string) {
    return await this.productService.deleteProduct(productId);
  }

  @Post(':productId/favorite')
  @UseGuards(AuthGuard)
  public async addProductToFavorites(
    @User('id')
    currentUserId: string,
    @Param('productId')
    productId: string,
  ) {
    return await this.productService.addProductToFavorites(currentUserId, productId)
  }

  @Delete(':productId/favorite')
  @UseGuards(AuthGuard)
  public async deleteProductFromFavorites(
    @User('id')
    currentUserId: string,
    @Param('productId')
    productId: string,
  ) {
    return await this.productService.deleteProductFromFavorites(currentUserId, productId)
  }

  @Post(':productId/comments')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  public async createComment(
    @Body('comment')
    commentCreateDto: CommentDto,
    @User('id')
    currentUserId: string,
    @Param('productId')
    productId: string,
  ) {
    return await this.productService.createComment(commentCreateDto, currentUserId, productId);
  }

  @Post('comments/:commentId')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  public async createSubComment(
    @Body('comment')
    commentCreateDto: CommentDto,
    @User('id')
    currentUserId: string,
    @Param('commentId')
    commentId: string,
  ) {
    return await this.productService.createSubComment(commentCreateDto, currentUserId, commentId);
  }

  @Patch('comments/:commentId')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  public async updateComment(
    @Body('comment')
    commentCreateDto: CommentDto,
    @User('id')
    currentUserId: string,
    @Param('commentId')
    commentId: string,
  ) {
    return await this.productService.updateComment(commentCreateDto, commentId, currentUserId);
  }

  @Patch('comments/:commentId/:option')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  public async likeOrDislikeComment(
    @User('id')
    currentUserId: string,
    @Param('commentId')
    commentId: string,
    @Param('option')
    option: string,
    //option param must be Like or Dislike for coresponding acts
  ) {
    return await this.productService.likeOrDislikeComment(commentId, currentUserId, option);
  }
}
