import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { AuthMiddleWare } from './middleware/auth.middleware';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { configService } from './config/config.service';

@Module({
  imports: [
    MongooseModule.forRoot(configService.get('MONGODB_CONNECTION_STRING')),
    ProductModule,
    UserModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleWare).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
