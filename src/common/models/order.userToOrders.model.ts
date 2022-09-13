import { Document } from 'mongoose';

export interface UserToOrdersInterface extends Document {
    user: string;
    order: string;
    created: Date;
    updated?: Date;
    deleted?: Date;
}