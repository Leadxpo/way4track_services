import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkAllocationEntity } from './entity/work-allocation.entity';
import { WorkAllocationService } from './work-allocation.service';
import { WorkAllocationController } from './work-allocation.controller';
import { WorkAllocationAdapter } from './work-allocation.adapter';
import { WorkAllocationRepository } from './repo/work-allocation.repo';
import { NotificationModule } from 'src/notifications/notification.module';
import { StaffModule } from 'src/staff/staff.module';
import { ProductModule } from 'src/product/product.module';
import { TechnicianModule } from 'src/technician-works/technician-work.module';
import { SalesworkModule } from 'src/sales-man/sales-man.module';

@Module({
    imports: [TypeOrmModule.forFeature([WorkAllocationEntity]),
    forwardRef(() => NotificationModule),
    forwardRef(() => StaffModule),
    forwardRef(() => TechnicianModule),
    forwardRef(() => SalesworkModule),

    forwardRef(() => ProductModule)],
    controllers: [WorkAllocationController],
    providers: [WorkAllocationService, WorkAllocationAdapter, WorkAllocationRepository],
    exports: [WorkAllocationRepository, WorkAllocationService]

})
export class WorkAllocationModule { }
