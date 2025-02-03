import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAssignEntity } from './entity/product-assign.entity';
import { ProductAssignController } from './product-assign.controller';
import { ProductAssignService } from './product-assign.service';
import { ProductAssignRepository } from './repo/product-assign.repo';
import { ProductAssignAdapter } from './product-assign.adapter';
import { BranchModule } from 'src/branch/branch.module';
import { StaffModule } from 'src/staff/staff.module';
import { ProductModule } from 'src/product/product.module';


@Module({
    imports: [TypeOrmModule.forFeature([ProductAssignEntity]),
    forwardRef(() => BranchModule),
    forwardRef(() => StaffModule),
    forwardRef(() => ProductModule)],
    controllers: [ProductAssignController],
    providers: [ProductAssignService, ProductAssignRepository, ProductAssignAdapter],
    exports: [ProductAssignRepository, ProductAssignService]

})
export class ProductAssignModule { }
