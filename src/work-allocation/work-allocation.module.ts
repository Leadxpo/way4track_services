import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkAllocationEntity } from './entity/work-allocation.entity';
import { WorkAllocationService } from './work-allocation.service';
import { WorkAllocationController } from './work-allocation.controller';
import { WorkAllocationAdapter } from './work-allocation.adapter';
import { WorkAllocationRepository } from './repo/work-allocation.repo';
import { NotificationModule } from 'src/notifications/notification.module';
import { StaffModule } from 'src/staff/staff.module';

@Module({
    imports: [TypeOrmModule.forFeature([WorkAllocationEntity]),
    forwardRef(() => NotificationModule),
    forwardRef(() => StaffModule)],
    controllers: [WorkAllocationController],
    providers: [WorkAllocationService, WorkAllocationAdapter, WorkAllocationRepository],
    exports: [WorkAllocationRepository, WorkAllocationService]

})
export class WorkAllocationModule { }
