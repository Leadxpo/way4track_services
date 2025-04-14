import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entity/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './repo/product.repo';
import { VendorModule } from 'src/vendor/vendor.module';
import { VoucherRepository } from 'src/voucher/repo/voucher.repo';
import { ProductTypeModule } from 'src/product-type/product-type.module';
import { BranchModule } from 'src/branch/branch.module';
import { SubDealerModule } from 'src/sub-dealer/sub-dealer.module';
import { StaffModule } from 'src/staff/staff.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProductEntity, VoucherRepository]),
        forwardRef(() => VendorModule),
        forwardRef(() => ProductTypeModule),
        forwardRef(() => BranchModule),
        forwardRef(() => SubDealerModule),
        forwardRef(() => StaffModule),
    ],
    controllers: [ProductController],
    providers: [ProductService, ProductRepository],
    exports: [ProductService, ProductRepository],
})
export class ProductModule { }
