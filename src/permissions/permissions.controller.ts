import { Body, Controller, Post } from "@nestjs/common";
import { PermissionsDto } from "./dto/permissions.dto";
import { CommonResponse } from "src/models/common-response";
import { PermissionIdDto } from "./dto/permission-id.dto";
import { PermissionsService } from "./permissions.services";

@Controller('permissions')
export class PermissionsController {
    constructor(private readonly service: PermissionsService) {

    }

    @Post('handlePermissionDetails')
    async handlePermissionDetails(@Body() dto: PermissionsDto): Promise<CommonResponse> {
        try {
            return this.service.handlePermissionDetails(dto);
        } catch (error) {
            console.log("Error in create Permission in services..", error)
        }
    }


    @Post('getPermissionDetails')
    async getPermissionDetails(@Body() req: PermissionIdDto): Promise<CommonResponse> {
        try {
            return this.service.getPermissionDetails(req);
        } catch (error) {
            console.log("Error in create Permission in services..", error);
            return new CommonResponse(false, 500, 'Error fetching Permission type details');
        }
    }

    @Post('getStaffPermissions')
    async getStaffPermissions(@Body() req: { staffId: string, companyCode: string, unitCode: string }): Promise<CommonResponse> {
        try {
            return this.service.getStaffPermissions(req);
        } catch (error) {
            console.log("Error in create Permission in services..", error);
            return new CommonResponse(false, 500, 'Error fetching Permission type details');
        }
    }

    @Post('editPermissions')
    async editPermissions(@Body() staffId: string, companyCode: string, unitCode: string): Promise<CommonResponse> {
        try {
            return this.service.editPermissions(staffId, companyCode, unitCode);
        } catch (error) {
            console.log("Error in create Permission in services..", error);
            return new CommonResponse(false, 500, 'Error fetching Permission type details');
        }
    }

    @Post('addPermissions')
    async addPermissions(@Body() staffId: string, companyCode: string, unitCode: string): Promise<CommonResponse> {
        try {
            return this.service.addPermissions(staffId, companyCode, unitCode);
        } catch (error) {
            console.log("Error in create Permission in services..", error);
            return new CommonResponse(false, 500, 'Error fetching Permission type details');
        }
    }

    @Post('viewPermissions')
    async viewPermissions(@Body() staffId: string, companyCode: string, unitCode: string): Promise<CommonResponse> {
        try {
            return this.service.viewPermissions(staffId, companyCode, unitCode);
        } catch (error) {
            console.log("Error in create Permission in services..", error);
            return new CommonResponse(false, 500, 'Error fetching Permission type details');
        }
    }

    @Post('deletePermissions')
    async deletePermissions(@Body() staffId: string, companyCode: string, unitCode: string): Promise<CommonResponse> {
        try {
            return this.service.deletePermissions(staffId, companyCode, unitCode);
        } catch (error) {
            console.log("Error in create Permission in services..", error);
            return new CommonResponse(false, 500, 'Error fetching Permission type details');
        }
    }
}