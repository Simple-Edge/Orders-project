import { IsAlpha, IsEmail, IsNotEmpty, IsNumber } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsAlpha()
    name: string;

    @IsNotEmpty()
    @IsAlpha()
    lastName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}