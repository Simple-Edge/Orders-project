<<<<<<< HEAD
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserInterface } from "../common/models/user.model";
import { User } from "../common/decorators/user.decorator";
import { AuthGuard } from "../guards/auth.guard";
import { CreateOrderDto } from "./dto/createOrder.dto";
import { OrderService } from "./order.service";
import { ProductInterface } from "src/common/models/product.model";
import { OrderInterface } from "src/common/models/order.model";
=======
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
>>>>>>> 614ecf373bb3b7ec44abf864b8d81b5411afc477

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

<<<<<<< HEAD
    @Post()
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    async createOrder(
        @User() currentUser: UserInterface,
        @Body('order') createOrderDto: CreateOrderDto,
    ): Promise<OrderInterface> {
        return await this.orderService.createOrder(currentUser, createOrderDto)
    }

    @Get()
    @UseGuards(AuthGuard)
    public async findOrders(
        @User() currentUser: UserInterface,
    ): Promise<OrderInterface[]> {
        return await this.orderService.findOrders();
    }
=======
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
>>>>>>> 614ecf373bb3b7ec44abf864b8d81b5411afc477

  @Delete(':orderId')
  @UseGuards(AuthGuard)
  async deleteProduct(
    @Param('orderId') productId: string,
    @User() currentUser: UserInterface,
  ) {
    return await this.orderService.deleteOrder(productId, currentUser);
  }

<<<<<<< HEAD
    @Put(':orderId')
    @UseGuards(AuthGuard)
    async makeOrderReady(
        @User() currentUser: UserInterface,
        @Param('orderId') productId: string
    ): Promise<OrderInterface> {
        return await this.orderService.makeOrderReady(productId)
    }

}
=======
  @Put(':orderId')
  @UseGuards(AuthGuard)
  async makeOrderReady(@Param('orderId') productId: string) {
    return await this.orderService.makeOrderReady(productId);
  }
}
>>>>>>> 614ecf373bb3b7ec44abf864b8d81b5411afc477
