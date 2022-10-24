import { Document } from 'mongoose';

export interface FavoriteProductsInterface extends Document {
    user: string;
    products: string[];
    created: Date;
    updated?: Date;
    deleted?: Date;
}