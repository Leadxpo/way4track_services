import { Injectable } from "@nestjs/common";
import { PermissionAdapter } from "./permissions.adapter";
import { PermissionRepository } from "./repo/permissions.repo";
import { CommonResponse } from "src/models/common-response";
import { PermissionsDto } from "./dto/permissions.dto";
import { ErrorResponse } from "src/models/error-response";
import { PermissionIdDto } from "./dto/permission-id.dto";
import { DesignationEnum } from "src/staff/entity/staff.entity";
import { Permission } from "./entity/permissions.entity";
import { Roles } from "./dto/role.enum";

@Injectable()
export class PermissionsService {
    constructor(
        private adapter: PermissionAdapter,
        private repo: PermissionRepository
    ) { }

    private getDefaultPermissions(designation: DesignationEnum): Permission[] {
        switch (designation) {
            case DesignationEnum.CEO:
                // If the designation is CEO, give all permissions
                return [
                    { name: Roles.Branch, add: true, edit: true, view: true },
                    { name: Roles.Assets, add: true, edit: true, view: true },
                    { name: Roles.Appointments, add: true, edit: true, view: true },
                    { name: Roles.Staff, add: true, edit: true, view: true },
                    { name: Roles.Client, add: true, edit: true, view: true },
                    { name: Roles.Vendor, add: true, edit: true, view: true },
                    { name: Roles.SubDealer, add: true, edit: true, view: true },
                    { name: Roles.Hiring, add: true, edit: true, view: true },
                    { name: Roles.Bank, add: true, edit: true, view: true },
                    { name: Roles.Product, add: true, edit: true, view: true },
                    { name: Roles.ProductAssign, add: true, edit: true, view: true },
                    { name: Roles.Tickets, add: true, edit: true, view: true },
                    { name: Roles.Voucher, add: true, edit: true, view: true },
                    { name: Roles.WorkAllocation, add: true, edit: true, view: true },
                    { name: Roles.Estimate, add: true, edit: true, view: true },
                    { name: Roles.Attendance, add: true, edit: true, view: true }
                ];

            case DesignationEnum.HR:
                return [
                    { name: Roles.Branch, add: false, edit: false, view: true },
                    { name: Roles.Assets, add: false, edit: false, view: false },
                    { name: Roles.Appointments, add: true, edit: true, view: true },
                    { name: Roles.Staff, add: true, edit: true, view: true },
                    { name: Roles.Client, add: false, edit: false, view: true },
                    { name: Roles.Vendor, add: false, edit: false, view: true },
                    { name: Roles.SubDealer, add: false, edit: false, view: true },
                    { name: Roles.Hiring, add: true, edit: true, view: true },
                    { name: Roles.Bank, add: false, edit: false, view: false },
                    { name: Roles.Product, add: false, edit: false, view: false },
                    { name: Roles.ProductAssign, add: false, edit: false, view: false },
                    { name: Roles.Tickets, add: true, edit: true, view: true },
                    { name: Roles.Voucher, add: true, edit: true, view: true },
                    { name: Roles.WorkAllocation, add: true, edit: true, view: true },
                    { name: Roles.Estimate, add: true, edit: true, view: true },
                    { name: Roles.Attendance, add: true, edit: true, view: true }
                ];

            case DesignationEnum.Accountant:
                return [
                    { name: Roles.Branch, add: true, edit: true, view: true },
                    { name: Roles.Assets, add: true, edit: true, view: true },
                    { name: Roles.Appointments, add: true, edit: true, view: true },
                    { name: Roles.Staff, add: true, edit: true, view: true },
                    { name: Roles.Client, add: true, edit: true, view: true },
                    { name: Roles.Vendor, add: true, edit: true, view: true },
                    { name: Roles.SubDealer, add: true, edit: true, view: true },
                    { name: Roles.Hiring, add: true, edit: true, view: true },
                    { name: Roles.Bank, add: true, edit: true, view: true },
                    { name: Roles.Product, add: true, edit: true, view: true },
                    { name: Roles.ProductAssign, add: true, edit: true, view: true },
                    { name: Roles.Tickets, add: true, edit: true, view: true },
                    { name: Roles.Voucher, add: true, edit: true, view: true },
                    { name: Roles.WorkAllocation, add: true, edit: true, view: true },
                    { name: Roles.Estimate, add: true, edit: true, view: true },
                    { name: Roles.Attendance, add: true, edit: true, view: true }
                ];
            case DesignationEnum.BranchManager:
                return [
                    { name: Roles.Branch, add: true, edit: true, view: true },
                    { name: Roles.Assets, add: true, edit: true, view: true },
                    { name: Roles.Appointments, add: true, edit: true, view: true },
                    { name: Roles.Staff, add: true, edit: true, view: true },
                    { name: Roles.Client, add: false, edit: false, view: true },
                    { name: Roles.Vendor, add: false, edit: false, view: true },
                    { name: Roles.SubDealer, add: false, edit: false, view: true },
                    { name: Roles.Hiring, add: true, edit: true, view: true },
                    { name: Roles.Bank, add: false, edit: false, view: false },
                    { name: Roles.Product, add: true, edit: true, view: true },
                    { name: Roles.ProductAssign, add: true, edit: true, view: true },
                    { name: Roles.Tickets, add: true, edit: true, view: true },
                    { name: Roles.Voucher, add: true, edit: true, view: true },
                    { name: Roles.WorkAllocation, add: true, edit: true, view: true },
                    { name: Roles.Estimate, add: true, edit: true, view: true },
                    { name: Roles.Attendance, add: true, edit: true, view: true }
                ];

            case DesignationEnum.WarehouseManager:
                return [
                    { name: Roles.Branch, add: true, edit: true, view: true },
                    { name: Roles.Assets, add: true, edit: true, view: true },
                    { name: Roles.Appointments, add: true, edit: true, view: true },
                    { name: Roles.Staff, add: true, edit: true, view: true },
                    { name: Roles.Client, add: false, edit: false, view: false },
                    { name: Roles.Vendor, add: true, edit: true, view: true },
                    { name: Roles.SubDealer, add: false, edit: false, view: false },
                    { name: Roles.Hiring, add: false, edit: false, view: false },
                    { name: Roles.Bank, add: false, edit: false, view: false },
                    { name: Roles.Product, add: true, edit: true, view: true },
                    { name: Roles.ProductAssign, add: true, edit: true, view: true },
                    { name: Roles.Tickets, add: true, edit: true, view: true },
                    { name: Roles.Voucher, add: true, edit: true, view: true },
                    { name: Roles.WorkAllocation, add: false, edit: false, view: false },
                    { name: Roles.Estimate, add: true, edit: true, view: true },
                    { name: Roles.Attendance, add: true, edit: true, view: true }
                ];
            case DesignationEnum.SubDealer:
                return [
                    { name: Roles.Branch, add: false, edit: false, view: false },
                    { name: Roles.Assets, add: false, edit: false, view: false },
                    { name: Roles.Appointments, add: false, edit: false, view: false },
                    { name: Roles.Staff, add: false, edit: false, view: false },
                    { name: Roles.Client, add: false, edit: false, view: false },
                    { name: Roles.Vendor, add: false, edit: false, view: false },
                    { name: Roles.SubDealer, add: false, edit: false, view: false },
                    { name: Roles.Hiring, add: false, edit: false, view: false },
                    { name: Roles.Bank, add: false, edit: false, view: false },
                    { name: Roles.Product, add: false, edit: false, view: true },
                    { name: Roles.ProductAssign, add: false, edit: false, view: false },
                    { name: Roles.Tickets, add: true, edit: true, view: true },
                    { name: Roles.Voucher, add: true, edit: true, view: true },
                    { name: Roles.WorkAllocation, add: false, edit: false, view: false },
                    { name: Roles.Estimate, add: false, edit: false, view: true },
                    { name: Roles.Attendance, add: false, edit: false, view: false }
                ];

            case DesignationEnum.Technician:
                return [
                    { name: Roles.Branch, add: false, edit: false, view: false },
                    { name: Roles.Assets, add: false, edit: false, view: true },
                    { name: Roles.Appointments, add: true, edit: true, view: true },
                    { name: Roles.Staff, add: false, edit: false, view: true },
                    { name: Roles.Client, add: false, edit: false, view: true },
                    { name: Roles.Vendor, add: false, edit: false, view: true },
                    { name: Roles.SubDealer, add: false, edit: false, view: true },
                    { name: Roles.Hiring, add: false, edit: false, view: false },
                    { name: Roles.Bank, add: false, edit: false, view: false },
                    { name: Roles.Product, add: false, edit: false, view: true },
                    { name: Roles.ProductAssign, add: false, edit: false, view: false },
                    { name: Roles.Tickets, add: true, edit: true, view: true },
                    { name: Roles.Voucher, add: true, edit: true, view: true },
                    { name: Roles.WorkAllocation, add: true, edit: true, view: true },
                    { name: Roles.Estimate, add: false, edit: false, view: true },
                    { name: Roles.Attendance, add: true, edit: true, view: true }
                ];

            case DesignationEnum.SalesMan:
                return [
                    { name: Roles.Branch, add: false, edit: false, view: false },
                    { name: Roles.Assets, add: false, edit: false, view: true },
                    { name: Roles.Appointments, add: true, edit: true, view: true },
                    { name: Roles.Staff, add: false, edit: false, view: true },
                    { name: Roles.Client, add: false, edit: false, view: true },
                    { name: Roles.Vendor, add: false, edit: false, view: true },
                    { name: Roles.SubDealer, add: false, edit: false, view: true },
                    { name: Roles.Hiring, add: false, edit: false, view: false },
                    { name: Roles.Bank, add: false, edit: false, view: false },
                    { name: Roles.Product, add: false, edit: false, view: true },
                    { name: Roles.ProductAssign, add: false, edit: false, view: false },
                    { name: Roles.Tickets, add: true, edit: true, view: true },
                    { name: Roles.Voucher, add: true, edit: true, view: true },
                    { name: Roles.WorkAllocation, add: true, edit: true, view: true },
                    { name: Roles.Estimate, add: false, edit: false, view: true },
                    { name: Roles.Attendance, add: true, edit: true, view: true }
                ];

            case DesignationEnum.CallCenter:
                return [
                    { name: Roles.Branch, add: false, edit: false, view: false },
                    { name: Roles.Assets, add: false, edit: false, view: true },
                    { name: Roles.Appointments, add: true, edit: true, view: true },
                    { name: Roles.Staff, add: false, edit: false, view: true },
                    { name: Roles.Client, add: false, edit: false, view: true },
                    { name: Roles.Vendor, add: false, edit: false, view: true },
                    { name: Roles.SubDealer, add: false, edit: false, view: true },
                    { name: Roles.Hiring, add: false, edit: false, view: false },
                    { name: Roles.Bank, add: false, edit: false, view: false },
                    { name: Roles.Product, add: false, edit: false, view: true },
                    { name: Roles.ProductAssign, add: false, edit: false, view: false },
                    { name: Roles.Tickets, add: true, edit: true, view: true },
                    { name: Roles.Voucher, add: true, edit: true, view: true },
                    { name: Roles.WorkAllocation, add: true, edit: true, view: true },
                    { name: Roles.Estimate, add: false, edit: false, view: true },
                    { name: Roles.Attendance, add: true, edit: true, view: true }
                ];

            default:
                return [];
        }
    }


    async savePermissionDetails(dto: PermissionsDto): Promise<CommonResponse> {
        try {
            if (!dto.designation) {
                throw new ErrorResponse(400, 'Designation is required');
            }

            dto.permissions = dto.permissions.length
                ? dto.permissions
                : this.getDefaultPermissions(dto.designation);

            const entity = this.adapter.convertPermissionDtoToEntity(dto);
            await this.repo.save(entity);

            return new CommonResponse(true, 65152, 'Permission Details Created Successfully');
        } catch (error) {
            throw new ErrorResponse(5416, error.message);
        }
    }



    async updatePermissionDetails(dto: PermissionsDto): Promise<CommonResponse> {
        try {
            const existingRecord = await this.repo.findOne({
                where: dto.id ? { id: dto.id } : { userId: dto.userId },
            });

            if (!existingRecord) {
                throw new ErrorResponse(5417, 'Permission record not found');
            }

            const updatedRecord = this.repo.merge(existingRecord, this.adapter.convertPermissionDtoToEntity(dto));
            await this.repo.save(updatedRecord);

            return new CommonResponse(true, 65152, 'Permission Details Updated Successfully');
        } catch (error) {
            throw new ErrorResponse(5416, error.message);
        }
    }

    async handlePermissionDetails(dto: PermissionsDto): Promise<CommonResponse> {
        if (dto.id) {
            return this.updatePermissionDetails(dto);
        } else {
            return this.savePermissionDetails(dto);
        }
    }

    async getPermissionDetails(req: PermissionIdDto): Promise<CommonResponse> {
        try {
            const permissions = await this.repo.findOne({
                where: { userId: req.userId, companyCode: req.companyCode, unitCode: req.unitCode },
            });

            if (!permissions) {
                return new CommonResponse(false, 404, 'Permissions not found');
            }
            return new CommonResponse(true, 200, 'Permission details fetched successfully', permissions);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }
}
