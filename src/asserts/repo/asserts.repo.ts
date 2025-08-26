import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { AssertsEntity, AssetType } from "../entity/asserts-entity";
import { BranchEntity } from "src/branch/entity/branch.entity";
import { CommonReq } from "src/models/common-req";
import { VoucherEntity } from "src/voucher/entity/voucher.entity";
import { StaffEntity } from "src/staff/entity/staff.entity";

@Injectable()
export class AssertsRepository extends Repository<AssertsEntity> {
    constructor(private dataSource: DataSource) {
        super(AssertsEntity, dataSource.createEntityManager());
    }

    async assertsCardData(req: {
        unitCode: string;
        companyCode: string; branch?: string
    }) {
        try {

            // Branch grouping
            const groupedBranchesQuery = this.createQueryBuilder('as')
                .select(['branch.name AS branchName'])
                .leftJoin(BranchEntity, 'branch', 'branch.id = as.branch_id')
                .where('as.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('as.unit_code = :unitCode', { unitCode: req.unitCode });

            if (req.branch) {
                groupedBranchesQuery.andWhere('branch.name = :branchName', { branchName: req.branch });
            }

            const groupedBranches = await groupedBranchesQuery.groupBy('branch.name').getRawMany();

            // Office assets
            const officeAssertsQuery = this.createQueryBuilder('as')
                .select('SUM(as.quantity)', 'total_office_asserts')
                .leftJoin(BranchEntity, 'br', 'br.id = as.branch_id')
                .where('as.asset_type = :officeAssetType', { officeAssetType: AssetType.OFFICE_ASSET })
                .andWhere('as.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('as.unit_code = :unitCode', { unitCode: req.unitCode });

            if (req.branch) {
                officeAssertsQuery.andWhere('br.name = :branchName', { branchName: req.branch });
            }

            const officeAsserts = await officeAssertsQuery.getRawOne();

            // Transport assets
            const transportAssertsQuery = this.createQueryBuilder('as')
                .select('SUM(as.quantity)', 'total_transport_asserts')
                .leftJoin(BranchEntity, 'br', 'br.id = as.branch_id')
                .where('as.asset_type = :transportAssetType', { transportAssetType: AssetType.TRANSPORT_ASSET })
                .andWhere('as.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('as.unit_code = :unitCode', { unitCode: req.unitCode });

            if (req.branch) {
                transportAssertsQuery.andWhere('br.name = :branchName', { branchName: req.branch });
            }

            const transportAsserts = await transportAssertsQuery.getRawOne();

            // Total assets
            const totalAssertsQuery = this.createQueryBuilder('as')
                .select('SUM(as.quantity)', 'total_asserts')
                .leftJoin(BranchEntity, 'br', 'br.id = as.branch_id')
                .where('as.company_code = :companyCode', { companyCode: req.companyCode })
                .andWhere('as.unit_code = :unitCode', { unitCode: req.unitCode });

            if (req.branch) {
                totalAssertsQuery.andWhere('br.name = :branchName', { branchName: req.branch });
            }

            const totalAsserts = await totalAssertsQuery.getRawOne();

            // Combining results
            const results = {
                groupedBranches: groupedBranches.map(branch => ({
                    branchName: branch.branchName || 'N/A',
                })),
                officeAsserts: Number(officeAsserts?.total_office_asserts || 0),
                transportAsserts: Number(transportAsserts?.total_transport_asserts || 0),
                totalAsserts: Number(totalAsserts?.total_asserts || 0),
            };

            return results;
        } catch (error) {
            console.error('Error in assertsCardData:', error);
            throw new Error('Error retrieving asserts card data');
        }
    }

    async getAssetDataByDate(req: {
        fromDate?: Date;
        toDate?: Date;
        companyCode?: string;
        unitCode?: string;
        branch?: string;
    }) {
        const query = this.createQueryBuilder('asset')
            .select([
                'asset.description AS description',
                'asset.asset_type AS assetType',
                'asset.payment_type AS paymentType',
                'asset.purchase_date AS purchaseDate',
                'asset.asserts_name AS assetName',
                'asset.asserts_amount AS assetAmount',
                'asset.taxable_amount AS taxableAmount',
                'asset.quantity AS quantity',
                'asset.created_by AS createBy',
                'staff.name AS createByName'
            ])
            .leftJoin(BranchEntity, 'branch', 'branch.id = asset.branch_id')
            .leftJoin(StaffEntity, 'staff', 'staff.id = asset.created_by')
            .where('asset.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('asset.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.fromDate) {
            query.andWhere('asset.purchase_date >= :fromDate', { fromDate: req.fromDate });
        }

        if (req.toDate) {
            query.andWhere('asset.purchase_date <= :toDate', { toDate: req.toDate });
        }

        if (req.branch) {
            query.andWhere('branch.name = :branchName', { branchName: req.branch });
        }

        const result = await query.getRawMany();
        return result;
    }




}
