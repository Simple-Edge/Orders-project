import { IsEmail, isEmail, IsNotEmpty, IsString } from "class-validator";


export class UpdateUserDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    readonly lastName: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;
}