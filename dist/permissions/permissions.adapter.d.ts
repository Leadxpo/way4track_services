import { PermissionEntity } from "./entity/permissions.entity";
import { PermissionsDto } from "./dto/permissions.dto";
export declare class PermissionAdapter {
    convertPermissionDtoToEntity(dto: PermissionsDto): PermissionEntity;
}
