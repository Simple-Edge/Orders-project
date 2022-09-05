import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { SchemasModule } from '../common/schemas/@schemas.module';

@Module({
  imports: [SchemasModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
