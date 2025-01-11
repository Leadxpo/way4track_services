import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { EstimateEntity } from "../entity/estimate.entity";
import { ClientEntity } from "src/client/entity/client.entity";
import { ClientStatusEnum } from "src/client/enum/client-status.enum";
import { InvoiceDto } from "src/voucher/dto/invoice.dto";



@Injectable()

export class EstimateRepository extends Repository<EstimateEntity> {

    constructor(private dataSource: DataSource) {
        super(EstimateEntity, dataSource.createEntityManager());
    }

    async getEstimates(req: {
        fromDate?: string; toDate?: string; status?: ClientStatusEnum; companyCode?: string;
        unitCode?: string
    }) {
        const query = this.createQueryBuilder('estimate')
            .select([
                'estimate.estimate_id AS estimateNumber',
                'client.name AS clientName',
                'estimate.estimate_date AS estimateDate',
                'estimate.expire_date AS expiryDate',
                'estimate.amount AS amount',
                'client.status AS status',
            ])
            .leftJoin(ClientEntity, 'client', 'client.id = estimate.client_id')
            .where('estimate.estimate_date BETWEEN :fromDate AND :toDate', {
                fromDate: req.fromDate,
                toDate: req.toDate,
            })
            .andWhere(`estimate.company_code = "${req.companyCode}"`)
            .andWhere(`estimate.unit_code = "${req.unitCode}"`)
        if (req.status) {
            query.andWhere('client.status = :status', { status: req.status });
        }

        const result = await query.getRawMany();
        return result;
    }
}