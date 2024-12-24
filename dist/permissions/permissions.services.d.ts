import { PermissionAdapter } from "./permissions.adapter";
import { PermissionRepository } from "./repo/permissions.repo";
import { CommonResponse } from "src/models/common-response";
import { PermissionsDto } from "./dto/permissions.dto";
import { PermissionIdDto } from "./dto/permission-id.dto";
export declare class PermissionsService {
    private adapter;
    private repo;
    constructor(adapter: PermissionAdapter, repo: PermissionRepository);
    private getDefaultPermissions;
    savePermissionDetails(dto: PermissionsDto): Promise<CommonResponse>;
    updatePermissionDetails(dto: PermissionsDto): Promise<CommonResponse>;
    handlePermissionDetails(dto: PermissionsDto): Promise<CommonResponse>;
    getPermissionDetails(req: PermissionIdDto): Promise<CommonResponse>;
}
