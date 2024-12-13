
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { AttendanceEntity } from './entity/attendence.entity';
import { AttendanceController } from './attendence.controller';
import { AttendanceService } from './attendence.service';
import { AttendanceAdapter } from './attendence.adapter';
import { AttendenceRepository } from './repo/attendence.repo';
import { BranchModule } from 'src/branch/branch.module';
import { StaffModule } from 'src/staff/staff.module';

@Module({
    imports: [TypeOrmModule.forFeature([AttendanceEntity, StaffEntity, BranchEntity]),
    forwardRef(() => BranchModule),
    forwardRef(() => StaffModule),
    ],
    controllers: [AttendanceController],
    providers: [AttendanceService, AttendanceAdapter, AttendenceRepository],
    exports: [AttendenceRepository, AttendanceService]
})
export class AttendanceModule { }