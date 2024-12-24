import { PermissionsDto } from "./dto/permissions.dto";
import { CommonResponse } from "src/models/common-response";
import { PermissionIdDto } from "./dto/permission-id.dto";
import { PermissionsService } from "./permissions.services";
export declare class PermissionsController {
    private readonly service;
    constructor(service: PermissionsService);
    handlePermissionDetails(dto: PermissionsDto): Promise<CommonResponse>;
    getPermissionDetails(req: PermissionIdDto): Promise<CommonResponse>;
}
