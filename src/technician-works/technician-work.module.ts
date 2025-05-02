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
import { ServiceTypeModule } from 'src/service-type/service.module';
import { ProductTypeModule } from 'src/product-type/product-type.module';
import { VehicleTypeModule } from 'src/vehicle-type/vehicle-type.module';
import { NotificationModule } from 'src/notifications/notification.module';
import { SubDealerModule } from 'src/sub-dealer/sub-dealer.module';
import { SubDealerStaffModule } from 'src/sub-dealer-staff/sub-dealer-staff.module';

@Module({
    imports: [TypeOrmModule.forFeature([TechnicianWorksEntity]),
    forwardRef(() => VoucherModule),
    forwardRef(() => VendorModule),
    forwardRef(() => ClientModule),
    forwardRef(() => WorkAllocationModule),
    forwardRef(() => StaffModule),
    forwardRef(() => ServiceTypeModule),
    forwardRef(() => VehicleTypeModule),
    forwardRef(() => ProductTypeModule),
    forwardRef(() => SubDealerModule),
    forwardRef(() => SubDealerStaffModule),

    forwardRef(() => NotificationModule),
    forwardRef(() => NotificationModule),
    forwardRef(() => ProductModule)],

    controllers: [TechnicianController],
    providers: [TechnicianService, TechnicianWorksAdapter, TechinicianWoksRepository],
    exports: [TechinicianWoksRepository, TechnicianService]

})
export class TechnicianModule { }


