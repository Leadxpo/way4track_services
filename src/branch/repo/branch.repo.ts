import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { BranchEntity } from "../entity/branch.entity";
import { BranchIdDto } from "../dto/branch-id.dto";

@Injectable()
export class BranchRepository extends Repository<BranchEntity> {
    constructor(private dataSource: DataSource) {
        super(BranchEntity, dataSource.createEntityManager());
    }

    async getBranchStaff(req: BranchIdDto) {
        const query = await this.createQueryBuilder('br')
            .select([
                'st.name AS name',
                'st.designation AS designation',
                'br.name AS branchName', 
                'st.staff_photo AS staffPhoto',
                'as.asserts_name AS assertsName',
                'as.asserts_photo AS assertsPhoto',
                'as.asserts_amount AS assertsAmount'
            ])
            .leftJoin('br.staff', 'st')
            .leftJoin('br.asserts', 'as')
            .where('br.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('br.unit_code = :unitCode', { unitCode: req.unitCode })
            .andWhere('br.id = :id', { id: req.id })
            .getRawMany();

        return query;
    }
}
