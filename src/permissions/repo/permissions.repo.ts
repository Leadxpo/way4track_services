import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PermissionEntity } from "../entity/permissions.entity";
import { StaffEntity } from "src/staff/entity/staff.entity";
import { BranchEntity } from "src/branch/entity/branch.entity";
import { ErrorResponse } from "src/models/error-response";
import { SubDealerEntity } from "src/sub-dealer/entity/sub-dealer.entity";


@Injectable()

export class PermissionRepository extends Repository<PermissionEntity> {

    constructor(private dataSource: DataSource) {
        super(PermissionEntity, dataSource.createEntityManager());
    }

    async getStaffPermissions(req: { staffId?: string,subDealerId?: number, companyCode: string, unitCode: string }) {
       

        const query = this.createQueryBuilder('permission')
            .select([
                'branch.name AS branchName',
                'staff.staff_id AS staffId',
                'staff.name AS staffName',
                'staff.designation AS designation',
                'staff.phone_number AS phoneNumber',
                'staff.dob AS dob',
                'staff.aadhar_number AS aadharNumber',
                'staff.address AS address',
                'staff.staff_photo AS staffPhoto',
                'sb.sub_dealer_id AS subDealerId',
                'sb.name AS subDealerName',
                'sb.sub_dealer_phone_number AS subDealerPhoneNumber',
                'sb.address AS subDealerAddress',
                'staff.email AS email',
                'sb.email AS subDealerEmail',
                'sb.aadhar_number AS subDealerAadharNumber',
                'permission.role AS role',
                'permission.permissions AS permissions',
                'permission.start_at AS startAt',
                'permission.end_at AS endAt',
            ])
            .leftJoin(StaffEntity, 'staff', 'staff.id = permission.staff_id')
            .leftJoin(BranchEntity, 'branch', 'branch.id = staff.branch_id')
            .leftJoin(SubDealerEntity, 'sb', 'sb.id = permission.sub_dealer_id')
            .where('permission.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('permission.unit_code = :unitCode', { unitCode: req.unitCode })
        if (req.staffId) {
            query.andWhere('staff.staff_id = :staffId', { staffId: req.staffId });
        }
        if (req.subDealerId) {
            query.andWhere('sb.id = :subDealerId', { subDealerId: req.subDealerId });
        }
        query.orderBy('permission.start_at', 'DESC').limit(1);

        const staffDetails = await query.getRawMany();
        return staffDetails;
    }



}

