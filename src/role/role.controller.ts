import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { RoleInterface } from "src/common/models/role.model";
import { RoleGuard } from "../guards/role.guard";
import { AuthGuard } from "../guards/auth.guard";
import { CreateUpdateRoleDto } from "./dto/create-update-role.dto";
import { RoleService } from "./role.service";
import { UserInterface } from "src/common/models/user.model";

@Controller('role')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Get()
    @UseGuards(new RoleGuard(['fullAcces']))
    public async rolesList() {
        return await this.roleService.roleList()
    }

    @Post()
    @UseGuards(new RoleGuard(['fullAcces']))
    @UsePipes(new ValidationPipe())
    public async createRole(
        @Body('role') roleCreateDto: CreateUpdateRoleDto,
    ): Promise<RoleInterface>  {
        return await this.roleService.createRole(roleCreateDto)
    }

    @Put(':roleId')
    @UseGuards(new RoleGuard(['fullAcces']))
    @UsePipes(new ValidationPipe())
    public async updateRole(
        @Body('role') roleUpdateDto: CreateUpdateRoleDto,
        @Param('roleId') roleId: string,
    ): Promise<RoleInterface> {
        return await this.roleService.updateRole(roleUpdateDto,roleId)
    }

    @Delete(':roleId')
    @UseGuards(new RoleGuard(['fullAcces']))
    public async deleteRole(@Param('roleId') roleId: string) {
       return await this.roleService.deleteRole(roleId)
    }

    @Put(':roleId/users/:userId')
    @UseGuards(new RoleGuard(['fullAcces']))
    @UsePipes(new ValidationPipe())
    public async giveRole(
        @Param('userId') userId: string,
        @Param('roleId') roleId: string,
    ): Promise<UserInterface> {
        return await this.roleService.changeUserRole(userId,roleId)
    }

}