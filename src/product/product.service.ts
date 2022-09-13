import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ProductInterface } from '../common/models/product.model';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<ProductInterface>,
  ) {}

  public async findProducts(): Promise<ProductInterface[]> {
    return this.productModel.find();
  }

  public async createProduct(createProductDto: CreateProductDto): Promise<ProductInterface>{
    const newProduct = new this.productModel();
    Object.assign(newProduct, createProductDto);
    newProduct.priceWithDiscount = this.applyDiscount(newProduct);

    return await newProduct.save();
  }

  public async updateProduct(productUpdateDto: UpdateProductDto, productId: string): Promise<ProductInterface>{
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

  public async findProductById(productId: string): Promise<ProductInterface>{
    return this.productModel.findById(productId);
  }

  private applyDiscount(productData: ProductInterface): number {
    return +(productData.price * ((100 - productData.discount) / 100)).toFixed(
      2,
    );
  }
}
