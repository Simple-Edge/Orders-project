import { Module } from "@nestjs/common";
import { SchemasModule } from "../common/schemas/@schemas.module";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";

@Module({
    imports: [SchemasModule],
    controllers: [OrderController],
    providers: [OrderService],
})
export class OrderModule {}