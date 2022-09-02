import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { AuthMiddleWare } from './user/middleware/auth.middleware';
import { UserModule } from './user/user.module';
@Module({
  imports: [ProductModule,UserModule,MongooseModule.forRoot('mongodb://127.0.0.1:27017/ordersdb')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleWare).forRoutes({
      path: "*",
      method: RequestMethod.ALL
    })
  }
}
