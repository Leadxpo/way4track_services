import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { SalesWorksEntity } from "../entity/sales-man.entity";
import { StaffEntity } from "src/staff/entity/staff.entity";
import { BranchEntity } from "src/branch/entity/branch.entity";



@Injectable()

export class SalesworkRepository extends Repository<SalesWorksEntity> {

    constructor(private dataSource: DataSource) {
        super(SalesWorksEntity, dataSource.createEntityManager());
    }
    async getSalesSearchDetails(req: {
        companyCode: string; unitCode: string; staffId?: number; name?: string, branch?: string

    }) {
        const query = this.createQueryBuilder('sa')
            .select([
                'sa.id as id',
                'sa.date as date',
                'sa.estimate_date as estimateDate',
                'sa.name as name', 
                'sa.phone_number as phoneNumber',  // Sales phone number
                'sa.requirement_details as requirementDetails',
                'sa.address as address',
                'sa.service as service',
                'sa.visiting_number as visitingNumber',
                'sa.leadStatus as leadStatus',
                'branch.name AS branchName',
                'sa.staff_id AS staffId',
                'staff.name AS staffName',
                'staff.phone_number AS staffPhoneNumber',  // Renamed to avoid duplicate alias
                'allocate_st.staff_id AS staffId',
                'allocate_st.name AS staffName',
                'allocate_st.phone_number AS staffPhoneNumber'  // Renamed to avoid duplicate alias
            ])
            .leftJoin(StaffEntity, 'staff', 'sa.staff_id = staff.id')  // Use leftJoin instead of leftJoinAndSelect
            .leftJoin(StaffEntity, 'allocate_st', 'sa.allocate_staff_id= staff.id')  // Use leftJoin instead of leftJoinAndSelect
            .leftJoin(BranchEntity, 'branch', 'branch.id = staff.branch_id')
            .where('sa.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('sa.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.staffId) {
            query.andWhere('staff.id = :staffId', { staffId: req.staffId });
        }

        if (req.branch) {
            query.andWhere('branch.name = :branch', { branch: req.branch });
        }

        if (req.name) {
            query.andWhere('LOWER(sa.name) LIKE LOWER(:name)', { name: `%${req.name}%` });
        }

        return query.getRawMany(); // Fetch sales details
    }


}