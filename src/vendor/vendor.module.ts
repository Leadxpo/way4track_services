import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorEntity } from './entity/vendor.entity';
import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';
import { VendorRepository } from './repo/vendor.repo';
import { VendorAdapter } from './vendor.adapter';
import { ProductModule } from 'src/product/product.module';
import { BranchModule } from 'src/branch/branch.module';
import { BranchRepository } from 'src/branch/repo/branch.repo';
import { MulterModule } from '@nestjs/platform-express';

@Module({
    imports: [
        TypeOrmModule.forFeature([VendorEntity, VendorRepository]),
        forwardRef(() => ProductModule),
        forwardRef(() => BranchModule),
        MulterModule.register({
            dest: './uploads',
        }),
    ],
    controllers: [VendorController],
    providers: [VendorService, VendorAdapter, VendorRepository, BranchRepository],
    exports: [VendorRepository, VendorService],
})
export class VendorModule { }


