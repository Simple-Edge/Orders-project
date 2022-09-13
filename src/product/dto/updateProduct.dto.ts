import { IsAlpha, IsNotEmpty, IsNumber } from "class-validator";

export class UpdateProductDto {

    @IsNotEmpty()
    @IsAlpha()
    name: string;
    
    @IsNotEmpty()
    @IsAlpha()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsNotEmpty()
    @IsNumber()
    count: number;

    @IsNumber()
    discount: number;
}