import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entity/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './repo/product.repo'; 
import { VendorModule } from 'src/vendor/vendor.module';
import { VoucherRepository } from 'src/voucher/repo/voucher.repo';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProductEntity, VoucherRepository]),
        forwardRef(() => VendorModule),
    ],
    controllers: [ProductController],
    providers: [ProductService, ProductRepository],
    exports: [ProductService, ProductRepository],
})
export class ProductModule { }
