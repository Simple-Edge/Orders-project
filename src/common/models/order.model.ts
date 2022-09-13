import { Document } from 'mongoose';
import { ProductInterface } from './product.model';

export interface OrderInterface extends Document {
    customerInfo: string;
    description?: string;
    products: [{
        productId: string | ProductInterface;
        count: number;
    }];
    totalPrice: number;
    readyToTake?: Date;
    created: Date;
    updated?: Date;
    deleted?: Date;
}


// calcSum () {
//     this.totalPrice = this.orderInfo.reduce((acc: number,cur: ProductEntity): number => {
//         return acc + cur.priceWithDiscount;
//     },0)
// } 