import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { User } from '../common/decorators/user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '../guards/auth.guard';
import { UserResponseInterface } from '../common/interfaces/user-response.interface';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserInterface } from '../common/models/user.model';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body('user') userDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(userDto);
    return this.userService.buildUserResponse(user);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async loginUser(
    @Body('user') userDto: LoginUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.loginUser(userDto);
    return this.userService.buildUserResponse(user);
  }

  @Put()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async UpdateCurrentUser(
    @User('id') currentUserId: string,
    @Body('user') updateUserDto: UpdateUserDto,
  ): Promise<UserInterface> {
    return this.userService.updateUser(currentUserId, updateUserDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  async currentUser(
    @User('id') currentUserId: string,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.currentUser(currentUserId);
    return this.userService.buildUserResponse(user);
  }
}
