import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserInterface } from "../common/models/user.model";
import { User } from "../common/decorators/user.decorator";
import { AuthGuard } from "../guards/auth.guard";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrderService } from "./order.service";
import { OrderInterface } from "../common/models/order.model";

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  public async createOrder(
    @User() currentUser: UserInterface,
    @Body('order') createOrderDto: CreateOrderDto,
  ): Promise<OrderInterface> {
    return await this.orderService.createOrder(currentUser,createOrderDto)
  }

  @Get()
  @UseGuards(AuthGuard)
  public async findOrders(
    @User() currentUser: UserInterface,
    @Query() query: any,
  ): Promise<OrderInterface[]> {
    return await this.orderService.findOrders(currentUser,query);
  }

  @Get('users')
  @UseGuards(AuthGuard)
  public async getOrdersCountAndUserId(
    @User() currentUser: UserInterface,
  ) {
    return await this.orderService.getOrdersCountAndUserId()
  }

  @Get(':orderId')
  @UseGuards(AuthGuard)
  public async findOrder(
    @Param('orderId') orderId: string,
  ): Promise<OrderInterface> {
    return await this.orderService.findOrderById(orderId)
  }

  @Delete(':orderId')
  @UseGuards(AuthGuard)
  public async deleteOrder(
    @Param('orderId') productId: string,
    @User() currentUser: UserInterface,
  ) {
    return await this.orderService.deleteOrder(productId, currentUser);
  }

  @Put(':orderId')
  @UseGuards(AuthGuard)
  public async makeOrderReady(@Param('orderId') productId: string): Promise<OrderInterface> {
    return await this.orderService.makeOrderReady(productId);
  }
}
