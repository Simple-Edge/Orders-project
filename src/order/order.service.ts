import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserInterface } from '../common/models/user.model';
import { OrderInterface } from '../common/models/order.model';
import { CreateOrderDto } from './dto/create-order.dto';
import { ProductInterface } from 'src/common/models/product.model';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order')
    private readonly orderModel: Model<OrderInterface>,
  ) {}

  async createOrder(
    currentUser: UserInterface,
    createOrderDto: CreateOrderDto,
  ) {
    const order = new this.orderModel();
    order.customerInfo = currentUser;
    order.orderInfo = createOrderDto.orderInfo;
    order.customerInfo.password = ' ';
    order.totalPrice = this.calcSum(order.orderInfo);
    currentUser.userOrders.push(order.id);
    console.log(currentUser);
    currentUser.save();
    return order.save();
  }

  async deleteOrder(orderId: string, currentUser: UserInterface): Promise<any> {
    const order = await this.findOrderById(orderId);
    if (!order) {
      throw new HttpException('Product does not exist', HttpStatus.NOT_FOUND);
    }

    currentUser.userOrders.splice(currentUser.userOrders.indexOf(orderId), 1);
    currentUser.save();

    return await this.orderModel.deleteOne({ id: orderId });
  }

  async makeOrderReady(orderId: string): Promise<OrderInterface> {
    const order = await this.findOrderById(orderId);
    order.readyToTake = true;

    return await order.save();
  }

  async findOrders() {
    return this.orderModel.find();
  }

  async findOrderById(orderId: string): Promise<OrderInterface> {
    return await this.orderModel.findById(orderId);
  }

  calcSum(orders: Array<ProductInterface>): number {
    return orders.reduce((acc: number, cur: ProductInterface): number => {
      return acc + cur.priceWithDiscount;
    }, 0);
  }
}
