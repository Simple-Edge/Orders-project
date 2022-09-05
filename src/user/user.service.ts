import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/createUser.dto';
import { UserInterface } from '../common/models/user.model';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '../../config';
import { LoginUserDto } from './dto/loginUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserResponseInterface } from '../common/interfaces/userResponse.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<UserInterface>,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    const userByEmail = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (userByEmail) {
      throw new HttpException(
        'Email already taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    createUserDto.password = await hash(createUserDto.password, 11);
    console.log(createUserDto);
    const newUser = new this.userModel();
    Object.assign(newUser, createUserDto);
    return await newUser.save();
  }

  public async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserInterface> {
    const user = await this.findById(userId);
    Object.assign(user, updateUserDto);
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

    delete user.password;

    return user;
  }

  public async currentUser(currentUserId: string) {
    const user = await this.userModel.findOne({ _id: currentUserId });

    // const orderlist = await this.orderRepository.find(
    //     {
    //         customerInfo: {
    //             id: currentUserId
    //         }
    //     }
    // )
    return user;
  }

  public async findById(id: string) {
    return await this.userModel.findById(id);
  }

  public generateJwt(user: UserInterface): string {
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

  public buildUserResponse(user: UserInterface): UserResponseInterface {
    return {
      user: user,
      token: this.generateJwt(user),
    };
  }
}
