import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { User } from "../common/decorators/user.decorator";
import { ProductInterface } from "../common/models/product.model";
import { AuthGuard } from "../guards/auth.guard";
import { CommentDto } from "./dto/create-update-comment.dto";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

import { ProductService } from "./product.service";

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

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

  @Post(':productId/favorite')
  @UseGuards(AuthGuard)
  async addProductToFavorites(
    @User('id')
    currentUserId: string,
    @Param('productId')
    productId: string,
  ) {
    return await this.productService.addProductToFavorites(currentUserId, productId)
  }

  @Delete(':productId/favorite')
  @UseGuards(AuthGuard)
  async deleteProductFromFavorites(
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
    return await this.productService.createComment(commentCreateDto,currentUserId,productId);
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
    return await this.productService.createSubComment(commentCreateDto,currentUserId,commentId);
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
    return await this.productService.updateComment(commentCreateDto,commentId,currentUserId);
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
    return await this.productService.likeOrDislikeComment(commentId,currentUserId,option);
  }
}
