import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FavoriteProductsInterface } from '../common/models/product.favorite-products.model';

import { ProductInterface } from '../common/models/product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<ProductInterface>,
    @InjectModel('FavoriteProduct')
    private readonly favoriteProductsModel: Model<FavoriteProductsInterface>,
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

  public async findProductById(productId: string): Promise<ProductInterface> {
    return this.productModel.findById(productId);
  }

  private applyDiscount(productData: ProductInterface): number {
    return +(productData.price * ((100 - productData.discount) / 100)).toFixed(
      2,
    );
  }
}
