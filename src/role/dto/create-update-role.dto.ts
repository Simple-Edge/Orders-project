import { Type } from "class-transformer";
import { IsAlpha, IsBoolean, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";

class PermissionDto {
    @IsBoolean()
    readonly fullAcces: boolean;
    @IsBoolean()
    readonly productFullAcces: boolean;
    @IsBoolean()
    readonly orderFullAcces: boolean;

    @IsBoolean()
    readonly productWrite: boolean;
    @IsBoolean()
    readonly productUpdate: boolean;
    @IsBoolean()
    readonly productDelete: boolean;

    @IsBoolean()
    readonly orderRead: boolean;
    @IsBoolean()
    readonly orderWrite: boolean;
    @IsBoolean()
    readonly orderUpdate: boolean;
    @IsBoolean()
    readonly orderDelete: boolean;

    @IsBoolean()
    readonly commentFullAcces: boolean;
}

export class CreateUpdateRoleDto {

    @IsNotEmpty()
    @IsString()
    readonly name: string;
    
    @IsNotEmpty()
    @IsString()
    readonly description: string;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => PermissionDto)
    readonly permissions: PermissionDto;
}