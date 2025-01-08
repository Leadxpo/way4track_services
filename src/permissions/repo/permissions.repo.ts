import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PermissionEntity } from "../entity/permissions.entity";
import { StaffEntity } from "src/staff/entity/staff.entity";
import { BranchEntity } from "src/branch/entity/branch.entity";
import { ErrorResponse } from "src/models/error-response";


@Injectable()

export class PermissionRepository extends Repository<PermissionEntity> {

    constructor(private dataSource: DataSource) {
        super(PermissionEntity, dataSource.createEntityManager());
    }

    async getStaffPermissions(req: { staffId?: string, companyCode: string, unitCode: string }) {
        console.log('companyCode:', req.companyCode);
        console.log('unitCode:', req.unitCode);
        console.log('staffId:', req.staffId);

        const query = this.createQueryBuilder('permission')
            .select([
                'branch.name AS branchName',
                'staff.staff_id AS staffId',
                'staff.name AS staffName',
                'staff.designation AS designation',
                'staff.phone_number AS phoneNumber',
                'staff.dob AS dob',
                'staff.address AS address',
                'staff.aadhar_number AS aadharNumber',
                'permission.role AS role',
                'permission.permissions AS permissions',
            ])
            .leftJoin(StaffEntity, 'staff', 'staff.id = permission.staff_id')
            .leftJoin(BranchEntity, 'branch', 'branch.id = staff.branch_id')
            .where('permission.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('permission.unit_code = :unitCode', { unitCode: req.unitCode })
        if (req.staffId) {
            query.andWhere('staff.staff_id = :staffId', { staffId: req.staffId });
        }

        const staffDetails = await query.getRawMany();
        console.log(staffDetails, "{{{{{{{{")
        return staffDetails;
    }



}

