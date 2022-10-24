import { IsAlpha, IsEmail, IsNotEmpty, IsNumber } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsAlpha()
    readonly name: string;

    @IsNotEmpty()
    @IsAlpha()
    readonly lastName: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    readonly password: string;
}