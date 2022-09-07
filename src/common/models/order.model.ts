import { Document } from 'mongoose';
import { ProductInterface } from './product.model';
import { UserInterface } from './user.model';

export interface OrderInterface extends Document {
    createdAt: Date,
    customerInfo: UserInterface,
    orderInfo: ProductInterface[],
    totalPrice: number,
    readyToTake?: boolean,
}


// calcSum () {
//     this.totalPrice = this.orderInfo.reduce((acc: number,cur: ProductEntity): number => {
//         return acc + cur.priceWithDiscount;
//     },0)
// } 