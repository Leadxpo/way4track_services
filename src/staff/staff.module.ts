import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffEntity } from './entity/staff.entity';
import { StaffController } from './staff.controller';
import { StaffRepository } from './repo/staff-repo';
import { StaffService } from './staff-services';
import { StaffAdapter } from './staff.adaptert';
import { AttendanceModule } from 'src/attendence/attendence.module';
import { StaffDashboardService } from 'src/dashboard/staff-dashboard.service';
import { MulterModule } from '@nestjs/platform-express';
import { PermissionModule } from 'src/permissions/permissions.module';
import { LettersModule } from 'src/letters/letters.module';
import { DesignationModule } from 'src/designation/designation.module';


@Module({
    imports: [TypeOrmModule.forFeature([StaffEntity]), MulterModule.register({
        dest: './uploads',
    }),
    forwardRef(() => AttendanceModule),
    forwardRef(() => LettersModule),
     forwardRef(() => DesignationModule),
    forwardRef(() => PermissionModule)],
    controllers: [StaffController],
    providers: [StaffService, StaffRepository, StaffAdapter, StaffDashboardService],
    exports: [StaffRepository, StaffService, StaffDashboardService]
})
export class StaffModule { }
