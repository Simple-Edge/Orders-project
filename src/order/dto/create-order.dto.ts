import { IsAlpha, IsArray, IsNotEmpty } from "class-validator"

export class CreateOrderDto {
    @IsAlpha()
    readonly description: string;
    @IsNotEmpty()
    @IsArray()
    readonly products: [
        {
            productId: string,
            count: number,
        }
    ];
}