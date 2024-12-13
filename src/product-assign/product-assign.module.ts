import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAssignEntity } from './entity/product-assign.entity';
import { ProductAssignController } from './product-assign.controller';
import { ProductAssignService } from './product-assign.service';
import { ProductAssignRepository } from './repo/product-assign.repo';
import { ProductAssignAdapter } from './product-assign.adapter';


@Module({
    imports: [TypeOrmModule.forFeature([ProductAssignEntity])],
    controllers: [ProductAssignController],
    providers: [ProductAssignService, ProductAssignRepository, ProductAssignAdapter],
    exports: [ProductAssignRepository, ProductAssignService]

})
export class ProductAssignModule { }
