import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionEntity } from './entity/permissions.entity';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.services';
import { PermissionRepository } from './repo/permissions.repo';
import { PermissionAdapter } from './permissions.adapter';


@Module({
    imports: [TypeOrmModule.forFeature([PermissionEntity])],
    controllers: [PermissionsController],
    providers: [PermissionsService, PermissionRepository, PermissionAdapter],
    exports: [PermissionRepository, PermissionsService],
})
export class PermissionModule { }
