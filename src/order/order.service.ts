import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserInterface } from '../common/models/user.model';
import { OrderInterface } from '../common/models/order.model';
import { CreateOrderDto } from './dto/createOrder.dto';
import { ProductInterface } from '../common/models/product.model';
import { UserToOrdersInterface } from '../common/models/order.userToOrders.model';


@Injectable()
export class OrderService {
    constructor(
        @InjectModel('Order')
        private readonly orderModel: Model<OrderInterface>,
        @InjectModel('UserToOrder')
        private readonly userToOrderModel: Model<UserToOrdersInterface>,
    ) { }

    public async createOrder(currentUser: UserInterface, createOrderDto: CreateOrderDto): Promise<OrderInterface> {
        const order = new this.orderModel();
        const userToOrder = new this.userToOrderModel();
        
        order.customerInfo = currentUser._id;
        Object.assign(order,createOrderDto)
        order.totalPrice = await this.calcSum(order)
        order.depopulate();
        
        userToOrder.user = currentUser._id;
        userToOrder.order = order._id;

        await userToOrder.save();
        return await order.save();

    }

    public async deleteOrder(orderId: string, currentUser: UserInterface): Promise<any> {
        const order = await this.findOrderById(orderId)
        if (!order) {
            throw new HttpException('Order does not exist', HttpStatus.NOT_FOUND);
        }

        await this.userToOrderModel.findOneAndUpdate({order: orderId},{deleted: new Date()})
        
    
        order.deleted = new Date() 
        return await this.orderModel.deleteOne({ id: orderId })
    }

    public async makeOrderReady(orderId: string): Promise<OrderInterface> {
        const order = await this.findOrderById(orderId)

        if (!order) {
            throw new HttpException('Order does not exist', HttpStatus.NOT_FOUND);
        }

        order.readyToTake = new Date();
        order.updated = new Date();
        return await order.save()
    }

    public async findOrders(): Promise<OrderInterface[]> {
        return await this.orderModel.find();
    }

    public async findOrderById(orderId: string): Promise<OrderInterface> {
        return await this.orderModel.findById(orderId);
    }

    private async calcSum(orders:OrderInterface): Promise<number> {
        await orders.populate({path:"products",populate:{path:"productId",model:"Product"}})
        const totalPrice = orders.products.reduce(
            (acc: number, cur: {productId: ProductInterface,count: number}): number => {
                return acc + (cur.productId.priceWithDiscount * cur.count);
            }, 0)
        return +(totalPrice).toFixed(2)
    }

}
