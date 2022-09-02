import { Body, Controller, Get, Post, Put, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { User } from "./decorators/user.decorator";
import { CreateUserDto } from "./dto/createUser.dto";
import { LoginUserDto } from "./dto/loginUser.dto";
import { AuthGuard } from "./guards/auth.guard";
import { UserResponceInterface } from "./types/userResponce.interface";
import { UserService } from "./user.service";
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserInterface } from "./user.model";


@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Post()
    @UsePipes(new ValidationPipe())
    async createUser(
        @Body('user') userDto: CreateUserDto
    ): Promise<UserResponceInterface> {
        const user = await this.userService.createUser(userDto)
        return this.userService.buildUserResponce(user)
    }

    @Post('login')
    @UsePipes(new ValidationPipe())
    async loginUser(
        @Body('user') userDto: LoginUserDto
    ): Promise<UserResponceInterface> {
        const user = await this.userService.loginUser(userDto)
        return this.userService.buildUserResponce(user)
    }

    @Put()
    @UseGuards(AuthGuard)
    @UsePipes(new ValidationPipe())
    async UpdateCurrentUser(
        @User('id') currentUserId: string,
        @Body('user') UpdateUserDto: UpdateUserDto,
    ): Promise<UserInterface> {
        return this.userService.updateUser(currentUserId,UpdateUserDto)
    }

    @Get()
    @UseGuards(AuthGuard)
    async currentUser(
        @User('id') currentUserId: string,
    ): Promise<UserResponceInterface> {
        const user = await this.userService.currentUser(currentUserId)
        return this.userService.buildUserResponce(user);
    }
}