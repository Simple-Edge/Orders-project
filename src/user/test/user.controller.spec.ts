import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { createUserDTOStub, createAnotherUserDTOStub, updateUserDTOStub, loginUserDTOStub, incorrectLoginUserDTOStub } from './stubs/user.dto.stub';
import { SchemasModule } from '../../common/schemas/@schemas.module';
import { RoleService } from '../../role/role.service'
import { closeInMongodConnection, rootMongooseTestModule } from '../../../test/root-test-module';

describe('UserController', () => {
  let userController: UserController;

  beforeEach(async () => {

    const app: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), SchemasModule],
      controllers: [UserController],
      providers: [
        UserService, RoleService
      ],
    }).compile();

    app.get<RoleService>(RoleService).onModuleInit()
    userController = app.get<UserController>(UserController);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });


  const userDTOStub = createUserDTOStub('bart')

  describe('createUser', () => {

    it('should return saved user', async () => {
      const createdUser = await userController.createUser(userDTOStub);
      expect(createdUser.user.email).toBe(userDTOStub.email);
    });

    it('should return error if email of created user alredy taken', async () => {
      await userController.createUser(userDTOStub);
      expect(async () => { await userController.createUser(userDTOStub) }).rejects.toThrow('Email already taken')
    });
  })
  describe('updateUser', () => {

    it('should return updated user', async () => {
      const createdUser = await userController.createUser(userDTOStub);
      const updatedUser = await userController.UpdateCurrentUser(createdUser.user._id, updateUserDTOStub);
      expect(updatedUser.user.lastName).toBe(updateUserDTOStub.lastName);
    });

    it('should return  error if email of updatedUser user alredy taken by another user', async () => {
      const anotherUser = await userController.createUser(createAnotherUserDTOStub);
      const createdUser = await userController.createUser(userDTOStub);
      expect(async () => {
        await userController.UpdateCurrentUser(createdUser.user._id, updateUserDTOStub)
      })
        .rejects.toThrow('Email already taken');
    })
  })

  describe('loginUser', () => {
    it('should return logined user', async () => {

      const createdUser = await userController.createUser(userDTOStub);
      const loginedUser = await userController.loginUser(loginUserDTOStub(userDTOStub.email));
      expect(loginedUser.user.email).toBe(createdUser.user.email);
    });

    it('should return error if email or password is incorrect', async () => {
      await userController.createUser(userDTOStub);
      expect(async () => { await userController.loginUser(incorrectLoginUserDTOStub) }).rejects.toThrow('email or password is invalid');
    });
  })


})
