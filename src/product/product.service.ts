import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentInterface } from '../common/models/product.comment.model';
import { FavoriteProductsInterface } from '../common/models/product.favorite-products.model';

import { ProductInterface } from '../common/models/product.model';
import { CommentDto } from './dto/create-update-comment.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<ProductInterface>,
    @InjectModel('FavoriteProduct')
    private readonly favoriteProductsModel: Model<FavoriteProductsInterface>,
    @InjectModel('Comment')
    private readonly commentModel: Model<CommentInterface>,
  ) { }

  public async findProducts(): Promise<ProductInterface[]> {
    return this.productModel.find();
  }

  public async createProduct(createProductDto: CreateProductDto): Promise<ProductInterface> {
    const newProduct = new this.productModel();
    Object.assign(newProduct, createProductDto);
    newProduct.priceWithDiscount = this.applyDiscount(newProduct);

    return await newProduct.save();
  }

  public async updateProduct(productUpdateDto: UpdateProductDto, productId: string): Promise<ProductInterface> {
    const product = await this.findProductById(productId);

    if (!product) {
      throw new NotFoundException('Product does not exist');
    }

    Object.assign(product, productUpdateDto);
    product.priceWithDiscount = this.applyDiscount(product);
    product.updated = new Date();
    return await product.save();
  }

  public async deleteProduct(productId: string): Promise<any> {
    const product = await this.findProductById(productId);

    if (!product) {
      throw new NotFoundException('Product does not exist');
    }
    product.deleted = new Date()
    return await this.productModel.deleteOne({ _id: productId });
  }

  public async addProductToFavorites(currentUserId: string, productId: string) {
    const product = await this.findProductById(productId);

    if (!product) {
      throw new NotFoundException('Product does not exist');
    }

    let favoriteList = await this.favoriteProductsModel.findOne({ user: currentUserId });

    if (favoriteList) {
      const isNotFavorited = favoriteList.products.findIndex(
        productInFavorites => productInFavorites == productId
      ) === -1;
      if (isNotFavorited) {
        favoriteList.products.push(productId);
        favoriteList.updated = new Date()
        product.favoriteCount++
        await product.save()
        return await favoriteList.save()
      }
      return favoriteList
    }

    favoriteList = new this.favoriteProductsModel();
    favoriteList.user = currentUserId;
    favoriteList.products.push(productId)
    product.favoriteCount++
    await product.save()
    return await favoriteList.save()

  }

  public async deleteProductFromFavorites(currentUserId: string, productId: string) {
    const product = await this.findProductById(productId);

    if (!product) {
      throw new NotFoundException('Product does not exist');
    }

    const favoriteList = await this.favoriteProductsModel.findOne({ user: currentUserId });

    const productIndex = favoriteList.products.findIndex(
      productInFavorites => productInFavorites == productId
    );
    if (productIndex != -1) {
      favoriteList.products.splice(productIndex, 1)
      favoriteList.updated = new Date()
      product.favoriteCount--
      await product.save()
      return await favoriteList.save()
    }
    return favoriteList

  }

  public async createComment(commentCreateDto: CommentDto, currentUserId: string, productId: string): Promise<CommentInterface> {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product does not exist');
    }
    const comment = new this.commentModel();
    Object.assign(comment, commentCreateDto);
    comment.user = currentUserId;
    comment.product = productId;
    comment.created = new Date();
    return await comment.save()
  }

  public async createSubComment(commentCreateDto: CommentDto, currentUserId: string, commentId: string): Promise<CommentInterface> {
    const comment = await this.commentModel.findById(commentId);

    if (!comment) {
      throw new NotFoundException('Comment does not exist');
    }

    if (!comment.product) {
      throw new HttpException('Subcomment cant be on subcomment', HttpStatus.BAD_REQUEST);
    }

    const subcomment = new this.commentModel();
    Object.assign(subcomment, commentCreateDto);
    subcomment.user = currentUserId;
    subcomment.created = new Date();
    comment.commentThread.push(subcomment._id)
    await comment.save()
    return await subcomment.save()
  }

  public async updateComment(commentCreateDto: CommentDto, commentId: string, currentUserId: string): Promise<CommentInterface> {
    const comment = await this.commentModel.findById(commentId);

    if (!comment) {
      throw new NotFoundException('Comment does not exist');
    }

    if (currentUserId != comment.user) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }

    Object.assign(comment, commentCreateDto);
    comment.updated = new Date();
    return await comment.save()
  }

  public async likeOrDislikeComment(commentId: string, currentUserId: string, option: string): Promise<CommentInterface> {
    const comment = await this.commentModel.findById(commentId);

    if (!comment) {
      throw new NotFoundException('Comment does not exist');
    }

    // if (currentUserId == comment.user) {
    //   throw new HttpException(`You can\'t ${option} your comment`, HttpStatus.FORBIDDEN);
    // }
    
    const likeInd = comment.usersLikes.findIndex(
      usersLiked => usersLiked == currentUserId
    )

    const dislikeInd = comment.usersDislikes.findIndex(
      usersDislikesd => usersDislikesd == currentUserId
    )
    
    if (option == 'Like') {
      console.log ()
      return await likeOrDislike(likeInd, dislikeInd,option)
    } else if (option == 'Dislike') {
      return await likeOrDislike(dislikeInd, likeInd,option)
    } else {
      throw new HttpException(`Option value is incorrect must be like or dislike not: ${option}`, HttpStatus.BAD_REQUEST);
    }

    async function likeOrDislike(a: number, b: number, option: string) {
      const keyOption = 'users' + option + 's'

      if (a == -1) {
        comment[keyOption].push(currentUserId)
        return await comment.save()
      }

      if (a != -1) {
        comment[keyOption].splice(a, 1)
        return await comment.save()
      }

      if (a == -1 && b != -1) {
        comment[keyOption].push(currentUserId)
        return await comment.save()
      }
    }

  }

  public async findProductById(productId: string): Promise<ProductInterface> {
    return this.productModel.findById(productId);
  }

  private applyDiscount(productData: ProductInterface): number {
    return +(productData.price * ((100 - productData.discount) / 100)).toFixed(
      2,
    );
  }
}
