import { Document } from 'mongoose';

export interface RoleInterface extends Document {
    name: string;
    description: string;
    permissions: PermissionInterface;
    created: Date;
    updated?: Date;
    deleted?: Date;
}

export interface PermissionInterface extends Document {
    fullAcces?: boolean;
    productFullAcces?: boolean;
    orderFullAcces?: boolean;

    productWrite?: boolean;
    productDelete?: boolean;

    orderRead?: boolean;
    orderWrite?: boolean;
    orderDelete?: boolean;

    commentFullAcces?: boolean;

}