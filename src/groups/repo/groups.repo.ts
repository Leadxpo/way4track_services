import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { GroupsEntity } from "../entity/groups.entity";



@Injectable()

export class GropusRepository extends Repository<GroupsEntity> {

    constructor(private dataSource: DataSource) {
        super(GroupsEntity, dataSource.createEntityManager());
    }


    async getGroupDataForTable(req: {
        underType?: string;
        under?: string;
        name?: string;
        companyCode: string;
        unitCode: string;
    }) {
        const query = this.createQueryBuilder('gp')
            .select([
                'gp.id AS id',
                'gp.name AS name',
                'gp.under_type AS underType',
                'gp.under AS under',
            ])
            .where('gp.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('gp.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.underType?.trim()) {
            query.andWhere('gp.under_type = :underType', { underType: req.underType });
        }
        if (req.under?.trim()) {
            query.andWhere('gp.under = :under', { under: req.under });
        }
        if (req.name?.trim()) {
            query.andWhere('gp.name = :name', { name: req.name });
        }

        const data = await query.getRawMany();
        return data || [];
    }

}