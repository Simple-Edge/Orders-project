import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserInterface } from "../common/models/user.model";
import { OrderInterface } from "../common/models/order.model";
import { CreateOrderDto } from "./dto/createOrder.dto";
import { ProductInterface } from "src/common/models/product.model";



@Injectable()
export class OrderService {
    constructor(
        @InjectModel('Order')
        private readonly orderModel: Model<OrderInterface>,
        @InjectModel('Product')
        private readonly productModel: Model<ProductInterface>,
    ) { }

    public async createOrder(currentUser: UserInterface, createOrderDto: CreateOrderDto): Promise<OrderInterface> {
        const order = new this.orderModel();

        
        order.customerInfo = currentUser._id;
        Object.assign(order,createOrderDto)
        order.totalPrice = await this.calcSum(order)
        order.depopulate()

        return order.save()

    }

    public async deleteOrder(orderId: string, currentUser: UserInterface): Promise<any> {
        const order = await this.findOrderById(orderId)
        if (!order) {
            throw new HttpException('Order does not exist', HttpStatus.NOT_FOUND);
        }

        // currentUser.userOrders.splice(currentUser.userOrders.indexOf(orderId), 1)
        // currentUser.save();
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