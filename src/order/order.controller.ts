import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserInterface } from '../common/models/user.model';
import { User } from '../common/decorators/user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async createOrder(
    @User() currentUser: UserInterface,
    @Body('order') createOrderDto: CreateOrderDto,
  ) {
    return this.orderService.createOrder(currentUser, createOrderDto);
  }

  @Get()
  public async findProducts() {
    return await this.orderService.findOrders();
  }

  @Delete(':orderId')
  @UseGuards(AuthGuard)
  async deleteProduct(
    @Param('orderId') productId: string,
    @User() currentUser: UserInterface,
  ) {
    return await this.orderService.deleteOrder(productId, currentUser);
  }

  @Put(':orderId')
  @UseGuards(AuthGuard)
  async makeOrderReady(@Param('orderId') productId: string) {
    return await this.orderService.makeOrderReady(productId);
  }
}
