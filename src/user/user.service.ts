import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UserInterface } from '../common/models/user.model';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '../../config';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseInterface } from '../common/interfaces/user-response.interface';
import { FavoriteProductsInterface } from '../common/models/product.favorite-products.model';
import { UserToOrdersInterface } from '../common/models/order.user-to-orders.model';
import { RoleInterface } from '../common/models/role.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<UserInterface>,
    @InjectModel('FavoriteProduct')
    private readonly favoriteProductsModel: Model<FavoriteProductsInterface>,
    @InjectModel('UserToOrder')
    private readonly userToOrderModel: Model<UserToOrdersInterface>,
    @InjectModel('Role')
    private readonly roleModel: Model<RoleInterface>,
  ) { }

  public async createUser(createUserDto: CreateUserDto): Promise<UserInterface> {
    const userByEmail = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (userByEmail) {
      throw new HttpException(
        'Email already taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const newUser = new this.userModel();
    Object.assign(newUser, createUserDto);
    newUser.password = await hash(newUser.password, 11);
    newUser.role = await (await this.roleModel.findOne({name: 'Customer'},{_id:1}))._id;
    return await newUser.save();
  }

  public async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserInterface> {
    const user = await this.findById(userId);
    const userByEmail = await this.userModel.findOne({
      email: updateUserDto.email,
    });
    if (userByEmail && userByEmail.email != user.email) {
      throw new HttpException(
        'Email already taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }


    Object.assign(user, updateUserDto);
    user.updated = new Date();
    return await user.save();
  }

  public async loginUser(loginUserDto: LoginUserDto): Promise<UserInterface> {
    const user = await this.userModel.findOne({
      email: loginUserDto.email,
    });

    if (!user) {
      throw new HttpException(
        'email or password is invalid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isPasswordCorrect = await compare(
      loginUserDto.password.toString(),
      user.password.toString(),
    );

    if (!isPasswordCorrect) {
      throw new HttpException(
        'email or password is invalid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    await user.save()
    delete user.password;

    return user;
  }

  public async currentUser(currentUserId: string): Promise<UserInterface> {
    return await this.findById(currentUserId);
  }

  public async findById(id: string): Promise<UserInterface> {
    return await this.userModel.findById(id);
  }

  private generateJwt(user: UserInterface): string {
    return sign(
      {
        _id: user._id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
      },
      JWT_SECRET,
    );
  }

  public async buildUserResponse(user: UserInterface): Promise<UserResponseInterface> {
    return {
      user: user,
      favoriteProducts: await this.favoriteProductsModel.findOne({ user: user._id }, { products: 1 }).populate('products'),
      orders: await this.userToOrderModel.find({ user: user._id }, { order: 1 }).populate('order'),
      token: this.generateJwt(user),
    };
  }
}
