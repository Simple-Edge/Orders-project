import { IsArray, IsNotEmpty } from "class-validator";
import { ProductInterface } from "../../common/models/product.model";

export class CreateOrderDto {
  @IsNotEmpty()
  @IsArray()
  orderInfo: ProductInterface[];
}
