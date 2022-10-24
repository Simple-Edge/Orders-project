import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserInterface } from "../common/models/user.model";
import { RoleInterface } from "../common/models/role.model";
import { CreateUpdateRoleDto } from "./dto/create-update-role.dto";
import { OnModuleInit } from "@nestjs/common/interfaces/hooks";

@Injectable()
export class RoleService implements OnModuleInit {
    constructor(
        @InjectModel('Role')
        private readonly roleModel: Model<RoleInterface>,
        @InjectModel('User')
        private readonly userModel: Model<UserInterface>,
    ) { }
    public async onModuleInit() {
        const isCustomerCreated = await this.roleModel.findOne({name: 'Customer'})
        if (!isCustomerCreated) {
            const customerRole = new this.roleModel();
            customerRole.name = 'Customer'
            customerRole.description = 'Auto-generated role for customer'
            await customerRole.save()
        }

    }

    public async roleList(): Promise<RoleInterface[]> {
        return await this.roleModel.find()
    }

    public async createRole(roleCreateDto: CreateUpdateRoleDto): Promise<RoleInterface> {
        const newRole = new this.roleModel();
        Object.assign(newRole,roleCreateDto)
        
        return await newRole.save();

    }

    public async updateRole(roleUpdateDto: CreateUpdateRoleDto, roleId: string): Promise<RoleInterface> {
        const role = await this.roleModel.findById(roleId);
        Object.assign(role, roleUpdateDto);
        role.updated = new Date();
        return await role.save();
    }

    public async deleteRole(roleId: string): Promise<any> {
        const role = await this.roleModel.findById(roleId);
        if (!role) {
            throw new HttpException('This role does not exist', HttpStatus.NOT_FOUND);
        }

        await this.roleModel.findOneAndUpdate({ _id: roleId }, { deleted: new Date() })

        return await this.roleModel.deleteOne({ _id: roleId })
    }

    public async changeUserRole(userId: string, roleId: string): Promise<UserInterface> {
        return await this.userModel.findOneAndUpdate({ _id: userId }, { role: roleId }, { new: true })
    }


}