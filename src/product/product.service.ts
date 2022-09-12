import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductInterface } from '../common/models/product.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product')
    private readonly productModel: Model<ProductInterface>,
  ) {}

  async findProducts() {
    return this.productModel.find();
  }

  async createProduct(createProductDto: CreateProductDto) {
    const newProduct = new this.productModel();
    Object.assign(newProduct, createProductDto);
    newProduct.priceWithDiscount = this.applyDiscount(newProduct);

    return await newProduct.save();
  }

  async updateProduct(productUpdateDto: UpdateProductDto, productId: string) {
    const product = await this.findProductById(productId);

    if (!product) {
      throw new NotFoundException('Product does not exist');
    }

    Object.assign(product, productUpdateDto);
    product.priceWithDiscount = this.applyDiscount(product);
    return await product.save();
  }

  async deleteProduct(productId: string): Promise<any> {
    const product = await this.findProductById(productId);

    if (!product) {
      throw new NotFoundException('Product does not exist');
    }

    return this.productModel.deleteOne({ _id: productId });
  }

  async findProductById(productId: string) {
    return this.productModel.findById(productId);
  }

  applyDiscount(productData: ProductInterface): number {
    return +(productData.price * ((100 - productData.discount) / 100)).toFixed(
      2,
    );
  }
}
