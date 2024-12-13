import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { SubDealerEntity } from "../entity/sub-dealer.entity";
import { VoucherEntity } from "src/voucher/entity/voucher.entity";
import { DetailSubDealerDto } from "../dto/detail-sub-dealer.dto";


@Injectable()

export class SubDealerRepository extends Repository<SubDealerEntity> {

    constructor(private dataSource: DataSource) {
        super(SubDealerEntity, dataSource.createEntityManager());
    }

    async getSubDealerData() {
        const query = await this.createQueryBuilder('sb')
            .select([
                'sb.sub_dealer_id AS SubDealerId',
                'sb.sub_dealer_phone_number AS phoneNumber',
                'sb.name AS name',
                'sb.starting_date AS joiningDate',
                'vr.payment_status AS paymentStatus',
                'vr.amount AS amount',
                'vr.voucher_id as voucherId',
            ])
            .leftJoin(VoucherEntity, 'vr', 'vr.id = sb.voucher_id')
            .getRawMany();
        return query;
    }

    async getDetailSubDealerData(req: DetailSubDealerDto) {
        const query = await this.createQueryBuilder('sb')
            .select([
                'sb.sub_dealer_id AS subDealerId',
                'sb.sub_dealer_phone_number AS phoneNumber',
                'sb.name AS name',
                'sb.starting_date AS joiningDate',
                'vr.payment_status AS paymentStatus',
                'vr.amount AS amount',
                'vr.voucher_id AS voucherId',
                'sb.email AS email',
                'sb.address AS address',
                'vr.name AS voucherName',
                'vr.generation_date AS generationDate',
                'vr.product_type AS productType',
            ])
            .leftJoin(VoucherEntity, 'vr', 'vr.id = sb.voucher_id')
            .where(`sb.sub_dealer_id='${req.subDealerId}'`)
            .groupBy(`vr.voucher_id `)
            .getRawOne();

        return query;
    }



}