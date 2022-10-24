import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserInterface } from '../common/models/user.model';
import { OrderInterface } from '../common/models/order.model';
import { CreateOrderDto } from './dto/create-order.dto';
import { ProductInterface } from '../common/models/product.model';
import { UserToOrdersInterface } from '../common/models/order.user-to-orders.model';
import { RoleInterface } from 'src/common/models/role.model';


@Injectable()
export class OrderService {
    constructor(
        @InjectModel('Order')
        private readonly orderModel: Model<OrderInterface>,
        @InjectModel('UserToOrder')
        private readonly userToOrderModel: Model<UserToOrdersInterface>,
        @InjectModel('User')
        private readonly userModel: Model<UserInterface>,
    ) { }

    public async createOrder(currentUser: UserInterface, createOrderDto: CreateOrderDto): Promise<OrderInterface> {
        const order = new this.orderModel();
        let userToOrder = await this.userToOrderModel.findOne({ user: currentUser._id })


        if (!userToOrder) {
            userToOrder = new this.userToOrderModel();
            userToOrder.user = currentUser._id;
        }

        order.customerInfo = currentUser._id;
        Object.assign(order, createOrderDto)
        order.totalPrice = await this.calcSum(order)
        order.depopulate();

        userToOrder.orders.push(order._id);

        await userToOrder.save();
        return await order.save();

    }

    public async deleteOrder(orderId: string, currentUser: UserInterface): Promise<any> {
        const order = await this.findOrderById(orderId)

        if (!order) {
            throw new HttpException('Order does not exist', HttpStatus.NOT_FOUND);
        }

        if (order.customerInfo.toString() != currentUser._id.toString()) {
            throw new HttpException('Thats not your order', HttpStatus.FORBIDDEN);
        }

        let userToOrder = await this.userToOrderModel.findOne({ user: currentUser._id })
        const orderIndex = userToOrder.orders.findIndex(
            id => id == orderId
        );

        userToOrder.orders.splice(orderIndex, 1)

        await this.userToOrderModel.findOneAndUpdate({ order: orderId }, { deleted: new Date() })

        userToOrder.updated = new Date()
        userToOrder.save()
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

    public async findOrders(user: UserInterface, query: any): Promise<OrderInterface[]> {
        await user.populate('role')
        const userRoles = user.role as unknown as RoleInterface

        if (query.page <= 0) {
            query.page = 1;
        }

        const pagination = { limit: 10, skip: (query.page - 1) * 5 }

        if (userRoles.permissions.orderFullAcces || userRoles.permissions.orderRead || userRoles.permissions.fullAcces) {
            if (query.userId) {
                return await this.orderModel.find({ customerInfo: query.userId }, {}, pagination)
            }
            return await this.orderModel.find({}, {}, pagination);
        }

        return await this.orderModel.find({ customerInfo: user._id }, {}, pagination)

    }

    public async getOrdersCountAndUserId() {
        return await this.userToOrderModel.aggregate([
            {
                $lookup: {
                    from: 'users',
                    foreignField: '_id',
                    localField: 'user',
                    as: 'user'
                }
            },
            {$unwind: '$user'},
            {
                $project: {
                    _id: 0,
                    userId: '$user._id',
                    userName: { $concat: ["$user.name", " ", "$user.lastName"] },
                    ordersCount: { $size: '$orders' }
                }
            },
        ])
    }

    public async findOrderById(orderId: string): Promise<OrderInterface> {
        return await this.orderModel.findById(orderId);
    }

    private async calcSum(orders: OrderInterface): Promise<number> {
        await orders.populate({ path: "products", populate: { path: "productId", model: "Product" } })
        const totalPrice = orders.products.reduce(
            (acc: number, cur: { productId: ProductInterface, count: number }): number => {
                return acc + (cur.productId.priceWithDiscount * cur.count);
            }, 0)
        return +(totalPrice).toFixed(2)
    }

}
