import { Injectable } from "@nestjs/common";
import { ClientEntity } from "src/client/entity/client.entity";
import { ClientStatusEnum } from "src/client/enum/client-status.enum";
import { DataSource, Repository } from "typeorm";
import { EstimateEntity } from "../entity/estimate.entity";
import { VendorEntity } from "src/vendor/entity/vendor.entity";
import { BranchEntity } from "src/branch/entity/branch.entity";
@Injectable()

export class EstimateRepository extends Repository<EstimateEntity> {

    constructor(private dataSource: DataSource) {
        super(EstimateEntity, dataSource.createEntityManager());
    }

    async getEstimates(req: {
        fromDate?: string;
        toDate?: string;
        status?: ClientStatusEnum;
        companyCode?: string;
        unitCode?: string;
    }) {
        const fromDate = req.fromDate || '';
        const toDate = req.toDate || '';

        const query = this.createQueryBuilder('estimate')
            .select([
                'estimate.id as id',
                'estimate.estimate_id AS estimateNumber',
                'client.name AS clientName',
                'estimate.estimate_date AS estimateDate',
                'estimate.expire_date AS expiryDate',
                'estimate.amount AS estimateAmount',
                'estimate.shipping_address AS shippingAddress',
                'estimate.product_details as productDetails'
            ])
            .leftJoin(ClientEntity, 'client', 'client.id = estimate.client_id')
            .leftJoin(VendorEntity, 'vendor', 'vendor.id = estimate.vendor_id')
            .leftJoin(BranchEntity, 'branch', 'branch.id = estimate.branch_id')
            .leftJoin('estimate.products', 'pa')
            .where('estimate.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('estimate.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.fromDate || req.toDate) {
            query.andWhere('estimate.estimate_date BETWEEN :fromDate AND :toDate', {
                fromDate,
                toDate,
            });
        }

        if (req.status) {
            query.andWhere('estimate.status = :status', { status: req.status });
        }

        const result = await query.getRawMany();
        return result;
    }

    async getEstimatesForReport(req: {
        estimateId?: string; companyCode?: string;
        unitCode?: string
    }) {
        const query = this.createQueryBuilder('estimate')
            .select([
                'estimate.id as id',
                'estimate.estimate_id AS estimateNumber',
                'client.name AS clientName',
                'estimate.estimate_date AS estimateDate',
                'estimate.expire_date AS expiryDate',
                'estimate.amount AS amount',
                'estimate.estimatePdfUrl',

            ])
            .leftJoinAndSelect(ClientEntity, 'client', 'client.id = estimate.client_id')
            .leftJoinAndSelect(VendorEntity, 'vendor', 'vendor.id = estimate.vendor_id')
            .leftJoinAndSelect('estimate.products', 'pa')
            .andWhere(`estimate.company_code = "${req.companyCode}"`)
            .andWhere(`estimate.unit_code = "${req.unitCode}"`)
        query.andWhere('estimate.estimate_id = :estimateId', { estimateId: req.estimateId });
        const result = await query.getRawMany();
        return result;
    }
}