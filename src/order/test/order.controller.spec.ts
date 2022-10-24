import { Test, TestingModule } from '@nestjs/testing';
import { SchemasModule } from '../../common/schemas/@schemas.module';
import { closeInMongodConnection, rootMongooseTestModule } from '../../../test/root-test-module';
import { OrderController } from '../order.controller';
import { OrderService } from '../order.service';
import { UserService } from '../../user/user.service';
import { createUserDTOStub } from '../../user/test/stubs/user.dto.stub';
import { UserInterface } from '../../common/models/user.model';
import { ProductService } from '../../product/product.service';
import { createOrderDTOStub } from './stubs/order.dto.stub';
import { createProductDTOStub } from '../../product/test/stubs/product.dto.sub';
import { RoleService } from '../../role/role.service';



describe('OrderController', () => {
  let orderController: OrderController;
  let user1: UserInterface;
  let user2: UserInterface;
  let productsDtoArr: { productId: string, count: number }[]

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), SchemasModule],
      controllers: [OrderController,],
      providers: [OrderService, UserService, ProductService,RoleService],
    }).compile();

    app.get<RoleService>(RoleService).onModuleInit()
    const productService = app.get<ProductService>(ProductService);
    orderController = app.get<OrderController>(OrderController);

    productsDtoArr = await Promise.all(
      createProductDTOStub.map(async (val) => {
        const product = await productService.createProduct(val)
        return { productId: product._id as string, count: product.count }
      })
    )

    user1 = await app.get<UserService>(UserService).createUser(createUserDTOStub('bart'))
    user2 = await app.get<UserService>(UserService).createUser(createUserDTOStub('barto'))

  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  const createOrder = async (productsDto:{ productId: string, count: number }[],user: UserInterface) => {
    return await orderController.createOrder(
      user,
      createOrderDTOStub(productsDto as [{ productId: string, count: number }])
    )
  }

  describe('createOrder', () => {
    it('should return new order"', async () => {
      const newOrder = await createOrder(productsDtoArr,user1)
      expect(newOrder.totalPrice).toBe(1920)
      expect(newOrder.description).toBe('some desc')
      expect(newOrder.customerInfo).toBe(user1._id)
    });
  });

  describe('findOrder', () => {
    it('should return order2', async () => {
      const order1 = await createOrder(productsDtoArr,user1)
      const order2 = await createOrder(productsDtoArr.splice(1,3),user1)
      
      expect((await orderController.findOrder(order2._id)).totalPrice).toBe(1320)
    });
  });

  describe('deleteOrder', () => {
    it('should delete order 1', async () => {
      const order1 = await createOrder(productsDtoArr,user1)
      const order2 = await createOrder(productsDtoArr.splice(1,3),user1)

      await orderController.deleteOrder(order1._id,user1)
      
      expect(!!(await orderController.findOrder(order1._id))).toBe(false)
      expect(!!(await orderController.findOrder(order2._id))).toBe(true)
    });

    it('should return error if user try to delete foreign order', async () => {
      const order1 = await createOrder(productsDtoArr,user1)
      
      expect(async () => {await orderController.deleteOrder(order1._id,user2)}).rejects.toThrow('Thats not your order')
    });

    it('should return error if targeted order alredy deleted or non-exist', async () => {
      const order1 = await createOrder(productsDtoArr,user1)
    
      await orderController.deleteOrder(order1._id,user1)
      
      expect(async () => {await orderController.deleteOrder(order1._id,user1)}).rejects.toThrow('Order does not exist')
    });
  });

  describe('makeOrderReady', () => {
    it('should update readyToTake field with current timestamp',async () => {
      const order1 = await createOrder(productsDtoArr,user1);
      expect((await orderController.makeOrderReady(order1._id)).readyToTake).toBeInstanceOf(Date);
    })

    it('should return error if targeted order alredy deleted or non-exist', async () => {
      const order1 = await createOrder(productsDtoArr,user1)
    
      await orderController.deleteOrder(order1._id,user1)
      
      expect(async () => {await orderController.deleteOrder(order1._id,user1)}).rejects.toThrow('Order does not exist')
    });
  })
});
