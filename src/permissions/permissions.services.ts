import { Injectable } from "@nestjs/common";
import { PermissionAdapter } from "./permissions.adapter";
import { PermissionRepository } from "./repo/permissions.repo";
import { CommonResponse } from "src/models/common-response";
import { PermissionsDto } from "./dto/permissions.dto";
import { ErrorResponse } from "src/models/error-response";
import { PermissionIdDto } from "./dto/permission-id.dto";
import { DesignationEnum, StaffEntity } from "src/staff/entity/staff.entity";
import { Permission, PermissionEntity } from "./entity/permissions.entity";
import { Roles } from "./dto/role.enum";
import { StaffRepository } from "src/staff/repo/staff-repo";

@Injectable()
export class PermissionsService {
    constructor(
        private adapter: PermissionAdapter,
        private repo: PermissionRepository,
        private readonly staffRepo: StaffRepository
    ) { }

    private getDefaultPermissions(designation: DesignationEnum): Permission[] {
        switch (designation) {
            case DesignationEnum.CEO:
                // If the designation is CEO, give all permissions
                return [
                    { name: Roles.Branch, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Assets, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Appointments, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Staff, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Client, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Vendor, add: true, edit: true, view: true, delete: true },
                    { name: Roles.SubDealer, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Hiring, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Bank, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Product, add: true, edit: true, view: true, delete: true },
                    { name: Roles.ProductAssign, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Tickets, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Voucher, add: true, edit: true, view: true, delete: true },
                    { name: Roles.WorkAllocation, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Estimate, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Attendance, add: true, edit: true, view: true, delete: true },
                    { name: Roles.RequestRaise, add: true, edit: true, view: true, delete: true },

                ];

            case DesignationEnum.HR:
                return [
                    { name: Roles.Branch, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Assets, add: false, edit: false, view: false, delete: false },
                    { name: Roles.Appointments, add: false, edit: false, view: false, delete: false },
                    { name: Roles.Staff, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Client, add: false, edit: false, view: false, delete: false },
                    { name: Roles.Vendor, add: false, edit: false, view: false, delete: false },
                    { name: Roles.SubDealer, add: false, edit: false, view: false, delete: false },
                    { name: Roles.Hiring, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Bank, add: false, edit: false, view: false, delete: false },
                    { name: Roles.Product, add: false, edit: false, view: false, delete: false },
                    { name: Roles.ProductAssign, add: false, edit: false, view: false, delete: false },
                    { name: Roles.Tickets, add: false, edit: false, view: false, delete: false },
                    { name: Roles.Voucher, add: false, edit: false, view: false, delete: false },
                    { name: Roles.WorkAllocation, add: false, edit: false, view: false, delete: false },
                    { name: Roles.Estimate, add: false, edit: false, view: false, delete: false },
                    { name: Roles.Attendance, add: true, edit: true, view: true, delete: true },
                    { name: Roles.RequestRaise, add: true, edit: true, view: true, delete: true },

                ];

            case DesignationEnum.Accountant:
                return [
                    { name: Roles.Branch, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Assets, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Appointments, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Staff, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Client, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Vendor, add: true, edit: true, view: true, delete: true },
                    { name: Roles.SubDealer, add: false, edit: false, view: false, delete: false },
                    { name: Roles.Hiring, add: false, edit: false, view: false, delete: false },
                    { name: Roles.Bank, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Product, add: false, edit: false, view: false, delete: false },
                    { name: Roles.ProductAssign, add: false, edit: false, view: false, delete: false },
                    { name: Roles.Tickets, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Voucher, add: true, edit: true, view: true, delete: true },
                    { name: Roles.WorkAllocation, add: false, edit: false, view: false, delete: false },
                    { name: Roles.Estimate, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Attendance, add: true, edit: true, view: true, delete: true },
                    { name: Roles.RequestRaise, add: true, edit: true, view: true, delete: true },

                ];
            case DesignationEnum.BranchManager:
                return [
                    { name: Roles.Branch, add: false, edit: false, view: false, delete: false },
                    { name: Roles.Assets, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Appointments, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Staff, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Client, add: false, edit: false, view: true, delete: true },
                    { name: Roles.Vendor, add: false, edit: false, view: false, delete: false },
                    { name: Roles.SubDealer, add: false, edit: false, view: true, delete: true },
                    { name: Roles.Hiring, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Bank, add: false, edit: false, view: false, delete: true },
                    { name: Roles.Product, add: true, edit: true, view: true, delete: true },
                    { name: Roles.ProductAssign, add: false, edit: false, view: false, delete: false },
                    { name: Roles.Tickets, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Voucher, add: true, edit: true, view: true, delete: true },
                    { name: Roles.WorkAllocation, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Estimate, add: false, edit: false, view: false, delete: false },
                    { name: Roles.Attendance, add: true, edit: true, view: true, delete: true },
                    { name: Roles.RequestRaise, add: true, edit: true, view: true, delete: true },

                ];

            case DesignationEnum.WarehouseManager:
                return [
                    { name: Roles.Branch, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Assets, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Appointments, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Staff, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Client, add: false, edit: false, view: false, delete: true },
                    { name: Roles.Vendor, add: true, edit: true, view: true, delete: true },
                    { name: Roles.SubDealer, add: false, edit: false, view: false, delete: true },
                    { name: Roles.Hiring, add: false, edit: false, view: false, delete: true },
                    { name: Roles.Bank, add: false, edit: false, view: false, delete: true },
                    { name: Roles.Product, add: true, edit: true, view: true, delete: true },
                    { name: Roles.ProductAssign, add: false, edit: false, view: false, delete: false },
                    { name: Roles.Tickets, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Voucher, add: true, edit: true, view: true, delete: true },
                    { name: Roles.WorkAllocation, add: false, edit: false, view: false, delete: false },
                    { name: Roles.Estimate, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Attendance, add: true, edit: true, view: true, delete: true },
                    { name: Roles.RequestRaise, add: true, edit: true, view: true, delete: true },

                ];
            case DesignationEnum.SubDealer:
                return [
                    { name: Roles.Branch, add: false, edit: false, view: false, delete: true },
                    { name: Roles.Assets, add: false, edit: false, view: false, delete: true },
                    { name: Roles.Appointments, add: false, edit: false, view: false, delete: true },
                    { name: Roles.Staff, add: false, edit: false, view: false, delete: true },
                    { name: Roles.Client, add: false, edit: false, view: false, delete: true },
                    { name: Roles.Vendor, add: false, edit: false, view: false, delete: true },
                    { name: Roles.SubDealer, add: false, edit: false, view: false, delete: true },
                    { name: Roles.Hiring, add: false, edit: false, view: false, delete: true },
                    { name: Roles.Bank, add: false, edit: false, view: false, delete: true },
                    { name: Roles.Product, add: false, edit: false, view: true, delete: true },
                    { name: Roles.ProductAssign, add: false, edit: false, view: false, delete: false },
                    { name: Roles.Tickets, add: false, edit: false, view: false, delete: false },
                    { name: Roles.Voucher, add: true, edit: true, view: true, delete: true },
                    { name: Roles.WorkAllocation, add: false, edit: false, view: false, delete: false },
                    { name: Roles.Estimate, add: false, edit: false, view: false, delete: false },
                    { name: Roles.Attendance, add: false, edit: false, view: false, delete: false },
                    { name: Roles.RequestRaise, add: true, edit: true, view: true, delete: true },

                ];

            case DesignationEnum.Technician:
                return [
                    { name: Roles.Branch, add: false, edit: false, view: false, delete: true },
                    { name: Roles.Assets, add: false, edit: false, view: true, delete: true },
                    { name: Roles.Appointments, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Staff, add: false, edit: false, view: true, delete: true },
                    { name: Roles.Client, add: false, edit: false, view: true, delete: true },
                    { name: Roles.Vendor, add: false, edit: false, view: true, delete: true },
                    { name: Roles.SubDealer, add: false, edit: false, view: true, delete: true },
                    { name: Roles.Hiring, add: false, edit: false, view: false, delete: true },
                    { name: Roles.Bank, add: false, edit: false, view: false, delete: true },
                    { name: Roles.Product, add: false, edit: false, view: true, delete: true },
                    { name: Roles.ProductAssign, add: false, edit: false, view: false, delete: true },
                    { name: Roles.Tickets, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Voucher, add: true, edit: true, view: true, delete: true },
                    { name: Roles.WorkAllocation, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Estimate, add: false, edit: false, view: true, delete: true },
                    { name: Roles.Attendance, add: true, edit: true, view: true, delete: true },
                    { name: Roles.RequestRaise, add: true, edit: true, view: true, delete: true },

                ];

            case DesignationEnum.SalesMan:
                return [
                    { name: Roles.Branch, add: false, edit: false, view: false, delete: true },
                    { name: Roles.Assets, add: false, edit: false, view: true, delete: true },
                    { name: Roles.Appointments, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Staff, add: false, edit: false, view: true, delete: true },
                    { name: Roles.Client, add: false, edit: false, view: true, delete: true },
                    { name: Roles.Vendor, add: false, edit: false, view: true, delete: true },
                    { name: Roles.SubDealer, add: false, edit: false, view: true, delete: true },
                    { name: Roles.Hiring, add: false, edit: false, view: false, delete: true },
                    { name: Roles.Bank, add: false, edit: false, view: false, delete: true },
                    { name: Roles.Product, add: false, edit: false, view: true, delete: true },
                    { name: Roles.ProductAssign, add: false, edit: false, view: false, delete: true },
                    { name: Roles.Tickets, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Voucher, add: true, edit: true, view: true, delete: true },
                    { name: Roles.WorkAllocation, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Estimate, add: false, edit: false, view: true, delete: true },
                    { name: Roles.Attendance, add: true, edit: true, view: true, delete: true },
                    { name: Roles.RequestRaise, add: true, edit: true, view: true, delete: true },

                ];

            case DesignationEnum.CallCenter:
                return [
                    { name: Roles.Branch, add: false, edit: false, view: false, delete: true },
                    { name: Roles.Assets, add: false, edit: false, view: true, delete: true },
                    { name: Roles.Appointments, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Staff, add: false, edit: false, view: true, delete: true },
                    { name: Roles.Client, add: false, edit: false, view: true, delete: true },
                    { name: Roles.Vendor, add: false, edit: false, view: true, delete: true },
                    { name: Roles.SubDealer, add: false, edit: false, view: true, delete: true },
                    { name: Roles.Hiring, add: false, edit: false, view: false, delete: true },
                    { name: Roles.Bank, add: false, edit: false, view: false, delete: true },
                    { name: Roles.Product, add: false, edit: false, view: true, delete: true },
                    { name: Roles.ProductAssign, add: false, edit: false, view: false, delete: true },
                    { name: Roles.Tickets, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Voucher, add: true, edit: true, view: true, delete: true },
                    { name: Roles.WorkAllocation, add: true, edit: true, view: true, delete: true },
                    { name: Roles.Estimate, add: false, edit: false, view: true, delete: true },
                    { name: Roles.Attendance, add: true, edit: true, view: true, delete: true },
                    { name: Roles.RequestRaise, add: true, edit: true, view: true, delete: true },

                ];

            default:
                return [];
        }
    }

    async savePermissionDetails(dto: PermissionsDto): Promise<CommonResponse> {
        try {
            // Fetch the staff entity based on the staffId provided in the DTO
            const staff = await this.staffRepo.findOne({ where: { staffId: dto.staffId } });

            if (!staff) {
                throw new ErrorResponse(5417, 'Staff not found');
            }

            // Debugging: Check if permissions are received or default is needed
            console.log("Incoming Permissions:", dto.permissions);

            // Set default permissions if not provided
            dto.permissions = dto.permissions ?? this.getDefaultPermissions(staff.designation);

            // Debugging: Check default permissions
            console.log("Default Permissions Applied:", dto.permissions);

            // Ensure permissions are not null
            if (!dto.permissions) {
                throw new ErrorResponse(5418, 'Default permissions not found');
            }

            // Convert DTO to entity
            const entity = this.adapter.convertPermissionDtoToEntity(dto);

            // Associate the existing staff entity with the permission entity
            entity.staffId = staff; // Use the full staff entity instead of just the ID

            // Store permissions directly as an array (without JSON.stringify)
            entity.permissions = dto.permissions;

            // Debugging: Check entity before saving
            console.log("Entity Before Save:", entity);

            // Save the permission entity
            await this.repo.insert(entity);

            return new CommonResponse(true, 65152, 'Permission Details Created Successfully');
        } catch (error) {
            console.error('Error:', error.message);
            throw new ErrorResponse(5416, error.message);
        }
    }

    async updatePermissionDetails(dto: PermissionsDto): Promise<CommonResponse> {
        try {
            // Ensure the staff entity exists
            const staff = await this.staffRepo.findOne({ where: { staffId: dto.staffId } });
            if (!staff) {
                throw new ErrorResponse(5417, 'Staff not found');
            }

            // Ensure the permission entity exists
            const permission = await this.repo.findOne({ where: { staffId: staff } });
            if (!permission) {
                throw new ErrorResponse(5417, 'Permission not found');
            }

            // Merge updated values
            const permissionEntity = this.adapter.convertPermissionDtoToEntity(dto);
            const updatedEntity = this.repo.merge(permission, permissionEntity);

            // Debugging: Check if the entity is valid before saving
            console.log("Updated Permission Entity:", updatedEntity);

            // Save changes
            await this.repo.save(updatedEntity);

            return new CommonResponse(true, 65152, 'Permission Details Updated Successfully');
        } catch (error) {
            console.error('Error:', error.message);
            throw new ErrorResponse(5416, error.message);
        }
    }

    async getPermissionDetails(req: PermissionIdDto): Promise<CommonResponse> {
        try {
            const permissions = await this.repo.findOne({
                where: { companyCode: req.companyCode, unitCode: req.unitCode },
                relations: ['subDealerId', 'staffId']
            });

            if (!permissions) {
                return new CommonResponse(false, 404, 'Permissions not found');
            }
            return new CommonResponse(true, 200, 'Permission details fetched successfully', permissions);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async addPermissions(staffId: string, companyCode: string, unitCode: string): Promise<CommonResponse> {
        const staff = await this.staffRepo.findOne({ where: { staffId: staffId, companyCode: companyCode, unitCode: unitCode } });
        if (!staff) {
            return new CommonResponse(false, 404, "staff not found")
        }
        const addPermission = await this.repo.findOne({ where: { staffId: staff, companyCode: companyCode, unitCode: unitCode } })
        if (!addPermission) {
            throw new Error('Product assignment not found');
        }

        addPermission.permissions[0].add = true;
        await this.repo.save(addPermission);
        return new CommonResponse(true, 200, 'Permission details fetched successfully', addPermission);

    }

    async viewPermissions(staffId: string, companyCode: string, unitCode: string): Promise<CommonResponse> {
        const staff = await this.staffRepo.findOne({ where: { staffId: staffId, companyCode: companyCode, unitCode: unitCode } });
        if (!staff) {
            return new CommonResponse(false, 404, "staff not found")
        }
        const addPermission = await this.repo.findOne({ where: { staffId: staff, companyCode: companyCode, unitCode: unitCode } })
        if (!addPermission) {
            throw new Error('Product assignment not found');
        }

        addPermission.permissions[0].view = true;
        await this.repo.save(addPermission);
        return new CommonResponse(true, 200, 'Permission details fetched successfully', addPermission);

    }

    async deletePermissions(staffId: string, companyCode: string, unitCode: string): Promise<CommonResponse> {
        const staff = await this.staffRepo.findOne({ where: { staffId: staffId, companyCode: companyCode, unitCode: unitCode } });
        if (!staff) {
            return new CommonResponse(false, 404, "staff not found")
        }
        const addPermission = await this.repo.findOne({ where: { staffId: staff, companyCode: companyCode, unitCode: unitCode } })
        if (!addPermission) {
            throw new Error('Product assignment not found');
        }

        addPermission.permissions[0].delete = true;
        await this.repo.save(addPermission);
        return new CommonResponse(true, 200, 'Permission details fetched successfully', addPermission);

    }

    async editPermissions(staffId: string, companyCode: string, unitCode: string): Promise<CommonResponse> {
        const staff = await this.staffRepo.findOne({ where: { staffId: staffId, companyCode: companyCode, unitCode: unitCode } });
        if (!staff) {
            return new CommonResponse(false, 404, "staff not found")
        }
        const addPermission = await this.repo.findOne({ where: { staffId: staff, companyCode: companyCode, unitCode: unitCode } })
        if (!addPermission) {
            throw new Error('Product assignment not found');
        }

        addPermission.permissions[0].edit = true;
        await this.repo.save(addPermission);
        return new CommonResponse(true, 200, 'Permission details fetched successfully', addPermission);

    }
    async getStaffPermissions(req: { staffId?: string, companyCode: string, unitCode: string }): Promise<CommonResponse> {
        const data = await this.repo.getStaffPermissions(req)
        if (!data) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", data)
        }

    }
}
