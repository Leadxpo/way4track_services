import { PermissionAdapter } from "./permissions.adapter";
import { PermissionRepository } from "./repo/permissions.repo";
import { CommonResponse } from "src/models/common-response";
import { PermissionsDto } from "./dto/permissions.dto";
import { PermissionIdDto } from "./dto/permission-id.dto";
import { StaffRepository } from "src/staff/repo/staff-repo";
import { DesignationService } from "src/designation/designation.service";
import { DesignationRepository } from "src/designation/repo/designation.repo";
export declare class PermissionsService {
    private adapter;
    private repo;
    private readonly staffRepo;
    private readonly designationSerie;
    private readonly desRepo;
    constructor(adapter: PermissionAdapter, repo: PermissionRepository, staffRepo: StaffRepository, designationSerie: DesignationService, desRepo: DesignationRepository);
    savePermissionDetails(dto: PermissionsDto): Promise<CommonResponse>;
    updatePermissionDetails(dto: PermissionsDto): Promise<CommonResponse>;
    getPermissionDetails(req: PermissionIdDto): Promise<CommonResponse>;
    addPermissions(staffId: string, companyCode: string, unitCode: string): Promise<CommonResponse>;
    viewPermissions(staffId: string, companyCode: string, unitCode: string): Promise<CommonResponse>;
    deletePermissions(staffId: string, companyCode: string, unitCode: string): Promise<CommonResponse>;
    editPermissions(staffId: string, companyCode: string, unitCode: string): Promise<CommonResponse>;
    getStaffPermissions(req: {
        staffId?: string;
        companyCode: string;
        unitCode: string;
    }): Promise<CommonResponse>;
}
