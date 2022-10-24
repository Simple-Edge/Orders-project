import { Document } from 'mongoose';

export interface UserToOrdersInterface extends Document {
    user: string;
    orders: string[];
    created: Date;
    updated?: Date;
    deleted?: Date;
}