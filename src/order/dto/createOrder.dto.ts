import { IsAlpha, IsArray, IsNotEmpty } from "class-validator"

export class CreateOrderDto {
    @IsAlpha()
    description: string;
    @IsNotEmpty()
    @IsArray()
    products:[
        {
            productId: string, 
            count: number,
        }
    ];
}