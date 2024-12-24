import { Injectable } from "@nestjs/common";
import { PermissionEntity } from "./entity/permissions.entity";
import { PermissionsDto } from "./dto/permissions.dto";
@Injectable()
export class PermissionAdapter {
    convertPermissionDtoToEntity(dto: PermissionsDto): PermissionEntity {
        const entity = new PermissionEntity();
        entity.userId = dto.userId;
        entity.userName = dto.userName;
        entity.phoneNumber = dto.phoneNumber;
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        entity.permissions = dto.permissions;
        entity.designation = dto.designation;
        entity.role = dto.role
        if (entity.id) {
            entity.id = dto.id;
        }
        return entity;
    }
}