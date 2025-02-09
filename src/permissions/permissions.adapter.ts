import { Injectable } from "@nestjs/common";
import { PermissionEntity } from "./entity/permissions.entity";
import { PermissionsDto } from "./dto/permissions.dto";
import { StaffEntity } from "src/staff/entity/staff.entity";
import { SubDealerEntity } from "src/sub-dealer/entity/sub-dealer.entity";
@Injectable()
export class PermissionAdapter {
    convertPermissionDtoToEntity(dto: PermissionsDto): PermissionEntity {
        const entity = new PermissionEntity();
        // entity.userId = dto.userId;
        // entity.userName = dto.userName;
        // entity.phoneNumber = dto.phoneNumber;
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        entity.permissions = dto.permissions;
        const sub = new SubDealerEntity()
        sub.id = dto.subDealerId
        entity.subDealerId = sub
        // entity.designation = dto.designation;
        // entity.role = dto.role
        const staff = new StaffEntity();
        staff.staffId = dto.staffId;
        entity.staffId = staff;
        if (entity.id) {
            entity.id = dto.id;
        }
        return entity;
    }
}