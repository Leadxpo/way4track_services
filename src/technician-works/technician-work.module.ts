import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from 'src/client/client.module';
import { ProductModule } from 'src/product/product.module';
import { StaffModule } from 'src/staff/staff.module';
import { VendorModule } from 'src/vendor/vendor.module';
import { VoucherModule } from 'src/voucher/voucher-module';
import { TechnicianWorksEntity } from './entity/technician-works.entity';
import { TechinicianWoksRepository } from './repo/technician-works.repo';
import { TechnicianWorksAdapter } from './technician-works.adapter';
import { TechnicianController } from './technician-works.controller';
import { TechnicianService } from './technician-works.service';
import { WorkAllocationModule } from 'src/work-allocation/work-allocation.module';

@Module({
    imports: [TypeOrmModule.forFeature([TechnicianWorksEntity]),
    forwardRef(() => VoucherModule),
    forwardRef(() => VendorModule),
    forwardRef(() => ClientModule),
    forwardRef(() => WorkAllocationModule),
    forwardRef(() => StaffModule),
    forwardRef(() => ProductModule)],
    controllers: [TechnicianController],
    providers: [TechnicianService, TechnicianWorksAdapter, TechinicianWoksRepository],
    exports: [TechinicianWoksRepository, TechnicianService]

})
export class TechnicianModule { }

