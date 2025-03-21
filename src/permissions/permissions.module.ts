import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionEntity } from './entity/permissions.entity';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.services';
import { PermissionRepository } from './repo/permissions.repo';
import { PermissionAdapter } from './permissions.adapter';
import { StaffModule } from 'src/staff/staff.module';
import { DesignationModule } from 'src/designation/designation.module';


@Module({
    imports: [TypeOrmModule.forFeature([PermissionEntity]),
    forwardRef(() => StaffModule),
    forwardRef(() => DesignationModule),
],
    controllers: [PermissionsController],
    providers: [PermissionsService, PermissionRepository, PermissionAdapter],
    exports: [PermissionRepository, PermissionsService],
})
export class PermissionModule { }
