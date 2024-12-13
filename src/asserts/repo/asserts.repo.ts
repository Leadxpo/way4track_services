import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { AssertsEntity, AssetType } from "../entity/asserts-entity";
import { BranchEntity } from "src/branch/entity/branch.entity";

@Injectable()
export class AssertsRepository extends Repository<AssertsEntity> {
    constructor(private dataSource: DataSource) {
        super(AssertsEntity, dataSource.createEntityManager());
    }

    async assertsCardData() {
        try {
            const office_asserts = await this.createQueryBuilder('as')
                .select('SUM(as.quantity)', 'total_office_asserts')
                .leftJoin(BranchEntity, 'br', 'br.id = as.branch_id')
                .where('as.asset_type = :officeAssetType', { officeAssetType: AssetType.OFFICE_ASSET })
                .getRawOne();
            console.log(office_asserts?.total_office_asserts, "++++=");

            const transport_asserts = await this.createQueryBuilder('as')
                .select('SUM(as.quantity)', 'total_transport_asserts')
                .leftJoin(BranchEntity, 'br', 'br.id = as.branch_id')
                .where('as.asset_type = :transportAssetType', { transportAssetType: AssetType.TRANSPORT_ASSET })
                .getRawOne();
            console.log(transport_asserts?.total_transport_asserts, "++++=");

            const totalAsserts = await this.createQueryBuilder('as')
                .select('SUM(as.quantity)', 'total_asserts')
                .leftJoin(BranchEntity, 'br', 'br.id = as.branch_id')
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
