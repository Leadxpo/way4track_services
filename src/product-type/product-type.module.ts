import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTypeEntity } from './entity/product-type.entity';
import { ProductTypeAdapter } from './product-type.adapter';
import { ProductTypeRepository } from './repo/product-type.repo';
import { ProductTypeService } from './product-type.service';
import { ProductTypeController } from './product-type.controller';

@Module({
    imports: [TypeOrmModule.forFeature([ProductTypeEntity])],
    providers: [ProductTypeService, ProductTypeAdapter, ProductTypeRepository],
    controllers: [ProductTypeController],
    exports: [ProductTypeRepository, ProductTypeService]

})
export class ProductTypeModule { }
