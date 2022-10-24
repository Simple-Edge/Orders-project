import { IsAlpha, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateProductDto {

    @IsNotEmpty()
    @IsAlpha()
    readonly name: string;
    
    @IsNotEmpty()
    @IsString()
    readonly description: string;

    @IsNotEmpty()
    @IsNumber()
    readonly price: number;

    @IsNotEmpty()
    @IsNumber()
    readonly count: number;

    @IsNumber()
    readonly discount: number;
}