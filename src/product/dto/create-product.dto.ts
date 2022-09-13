import { IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  productName: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  productCount: number;

  @IsNotEmpty()
  discount: number;
}
