import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { AssertsEntity, AssetType } from "../entity/asserts-entity";
import { BranchEntity } from "src/branch/entity/branch.entity";
import { CommonReq } from "src/models/common-req";

@Injectable()
export class AssertsRepository extends Repository<AssertsEntity> {
    constructor(private dataSource: DataSource) {
        super(AssertsEntity, dataSource.createEntityManager());
    }

    async assertsCardData(req: CommonReq) {
        try {
            console.log('Service input:', req);
            const office_asserts = await this.createQueryBuilder('as')
                .select('SUM(as.quantity)', 'total_office_asserts')
                .leftJoin(BranchEntity, 'br', 'br.id = as.branch_id')
                .where('as.asset_type = :officeAssetType', { officeAssetType: AssetType.OFFICE_ASSET })
                .andWhere('as.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('as.unit_code = :unitCode', { unitCode: req.unitCode })
                // .andWhere(`as.company_code = "${req.companyCode}"`)
                // .andWhere(`as.unit_code = "${req.unitCode}"`)
                .getRawOne();
            console.log(office_asserts?.total_office_asserts, "++++=");

            const transport_asserts = await this.createQueryBuilder('as')
                .select('SUM(as.quantity)', 'total_transport_asserts')
                .leftJoin(BranchEntity, 'br', 'br.id = as.branch_id')
                .where('as.asset_type = :transportAssetType', { transportAssetType: AssetType.TRANSPORT_ASSET })
                .andWhere('as.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('as.unit_code = :unitCode', { unitCode: req.unitCode })
                .getRawOne();
            console.log(transport_asserts?.total_transport_asserts, "++++=");

            const totalAsserts = await this.createQueryBuilder('as')
                .select('SUM(as.quantity)', 'total_asserts')
                .leftJoin(BranchEntity, 'br', 'br.id = as.branch_id')
                .where('as.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('as.unit_code = :unitCode', { unitCode: req.unitCode })
                .getRawOne();
            console.log(totalAsserts?.total_asserts, "++++=");

            return {
                officeAsserts: office_asserts?.total_office_asserts || 0,
                transportAsserts: transport_asserts?.total_transport_asserts || 0,
                totalAsserts: totalAsserts?.total_asserts || 0,
            };
        } catch (error) {
            console.error("Error in assertsCardData:", error);
            throw new Error('Error retrieving asserts card data');
        }
    }
}
