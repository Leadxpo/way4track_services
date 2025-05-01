
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from './entity/cart.entity';
import { CartRepository } from './repo/cart-repo';
import { CartAdapter } from './adapter/cart-.adapter';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
@Module({
    imports: [TypeOrmModule.forFeature([CartEntity])],
    providers: [CartService, CartAdapter, CartRepository],
    controllers: [CartController],
    exports: [CartRepository, CartService]
})
export class CartModule { }
