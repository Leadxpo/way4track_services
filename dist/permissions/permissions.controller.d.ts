import { PermissionsDto } from "./dto/permissions.dto";
import { CommonResponse } from "src/models/common-response";
import { PermissionIdDto } from "./dto/permission-id.dto";
import { PermissionsService } from "./permissions.services";
export declare class PermissionsController {
    private readonly service;
    constructor(service: PermissionsService);
    updatePermissionDetails(dto: PermissionsDto): Promise<CommonResponse>;
    savePermissionDetails(dto: PermissionsDto): Promise<CommonResponse>;
    getPermissionDetails(req: PermissionIdDto): Promise<CommonResponse>;
    getStaffPermissions(req: {
        staffId?: string;
        companyCode: string;
        unitCode: string;
    }): Promise<CommonResponse>;
    editPermissions({ staffId, companyCode, unitCode }: {
        staffId: string;
        companyCode: string;
        unitCode: string;
    }): Promise<CommonResponse>;
    addPermissions({ staffId, companyCode, unitCode }: {
        staffId: string;
        companyCode: string;
        unitCode: string;
    }): Promise<CommonResponse>;
    viewPermissions({ staffId, companyCode, unitCode }: {
        staffId: string;
        companyCode: string;
        unitCode: string;
    }): Promise<CommonResponse>;
    deletePermissions(staffId: string, companyCode: string, unitCode: string): Promise<CommonResponse>;
}
