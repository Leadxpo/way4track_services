import { Injectable } from "@nestjs/common";
import { PermissionEntity } from "./entity/permissions.entity";
import { PermissionsDto } from "./dto/permissions.dto";
import { StaffEntity } from "src/staff/entity/staff.entity";
import { SubDealerEntity } from "src/sub-dealer/entity/sub-dealer.entity";
import { DesignationEntity } from "src/designation/entity/designation.entity";
@Injectable()
export class PermissionAdapter {
    convertPermissionDtoToEntity(dto: PermissionsDto): PermissionEntity {
        const entity = new PermissionEntity();
        entity.companyCode = dto.companyCode;
        entity.unitCode = dto.unitCode;
        entity.permissions = dto.permissions;
        const sub = new SubDealerEntity()
        sub.id = dto.subDealerId
        entity.subDealerId = sub
        const staff = new StaffEntity();
        staff.staffId = dto.staffId;
        entity.staffId = staff;
        entity.startDate = dto.startDate
        entity.endDate = dto.endDate
        if (entity.id) {
            entity.id = dto.id;
        }
        entity.staffStatus = dto.staffStatus
        return entity;
    }
}