import { IsNotEmpty } from "class-validator";

export class UpdateProductDto {

    @IsNotEmpty()
    productName: string;
    
    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    price: number;

    @IsNotEmpty()
    productCount: number;

    discount: number;
}