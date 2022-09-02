import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateProductDto } from "./dto/createProduct.dto";
import { UpdateProductDto } from "./dto/updateProduct.dto";
import { ProductInterface } from "./product.model";

@Injectable()
export class ProductService {
    constructor(
        @InjectModel('Product') 
        private readonly productModel: Model<ProductInterface>
    ) {}

    async findProducts() {
        return await this.productModel.find()
    }
    
    async createProduct(createProductDto: CreateProductDto) {
        const newProduct = new this.productModel();
        Object.assign(newProduct,createProductDto);
        newProduct.priceWithDiscount = this.applyDiscount(newProduct)

        return await newProduct.save()
    }

    async updateProduct(productUpdateDto: UpdateProductDto,productId: string) {
        const product = await this.findProductById(productId)

        if (!product) {
            throw new HttpException('Product does not exist', HttpStatus.NOT_FOUND);
        }

        Object.assign(product,productUpdateDto)
        product.priceWithDiscount = this.applyDiscount(product)
        return await product.save()
    }

    async deleteProduct(productId: string):Promise<any> {
        const product = await this.findProductById(productId)

        if (!product) {
            throw new HttpException('Product does not exist', HttpStatus.NOT_FOUND);
        }

        return await this.productModel.deleteOne({_id: productId})
    }

    async findProductById (productId: string) {
        return await this.productModel.findById(productId);
    }

    applyDiscount (productData: ProductInterface): number {
        return +(productData.price * ((100 - productData.discount)/100)).toFixed(2)
    }
    
}