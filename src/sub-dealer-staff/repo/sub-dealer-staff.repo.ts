import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { SubDelaerStaffEntity } from "../entity/sub-dealer-staff.entity";
import { StaffSearchDto } from "src/staff/dto/staff-search.dto";
import { SubDealerEntity } from "src/sub-dealer/entity/sub-dealer.entity";




@Injectable()

export class SubDealerStaffRepository extends Repository<SubDelaerStaffEntity> {

    constructor(private dataSource: DataSource) {
        super(SubDelaerStaffEntity, dataSource.createEntityManager());
    }
    async getSubDealerStaffSearchDetails(req: StaffSearchDto) {
        const query = this.createQueryBuilder('sbf')
            .select([
                'sbf.id as sbfid',
                'sb.id as sbid',
                'sb.name AS subDealerName',
                'sb.sub_dealer_id as subDealerId',
                'sbf.staff_id AS staffId',
                'sbf.name AS staffName',
                'sbf.phone_number AS phoneNumber',
                'sbf.description as description'
            ])
            .leftJoinAndSelect(SubDealerEntity, 'sb', 'sb.id = sbf.sub_dealer_id')
            .where('sbf.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('sbf.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.subDealerId) {
            query.andWhere('sb.sub_dealer_id = :subDealerId', { subDealerId: req.subDealerId });
        }

        // Use getRawMany if you want to use custom column aliases
        const staffDetails = await query.getRawMany();
        return staffDetails;
    }

}