import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderEntity } from "./entity/orders.entity";
import { OrderController } from "./order.controller";
import { OrderAdapter } from "./order.adapter";
import { OrderService } from "./order.service";
import { OrderRepository } from "./repo/order-repo";
import { DevicesModule } from "src/devices/devices.module";


@Module({
    imports: [TypeOrmModule.forFeature([OrderEntity]),
    forwardRef(() => DevicesModule)],
    providers: [OrderService, OrderAdapter, OrderRepository],
    controllers: [OrderController],
    exports: [OrderRepository, OrderService]
})
export class OrdersModule { }
