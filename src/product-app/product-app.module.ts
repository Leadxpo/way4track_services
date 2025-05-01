import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAppService } from './product-app.service';
import { ProductAppController } from './product-app.controller';
import { ProductAppEntity } from './entity/product-app.entity';
import { ProductAppAdapter } from './product-app.adapter';
import { ProductAppRepository } from './repo/product-app.repo';

@Module({
    imports: [TypeOrmModule.forFeature([ProductAppEntity])],
    providers: [ProductAppService, ProductAppAdapter, ProductAppRepository],
    controllers: [ProductAppController],
    exports: [ProductAppRepository, ProductAppService, ProductAppAdapter]

})
export class ProductAppModule { }
