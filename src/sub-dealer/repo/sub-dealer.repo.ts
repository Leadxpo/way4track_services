import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { SubDealerEntity } from "../entity/sub-dealer.entity";
import { VoucherEntity } from "src/voucher/entity/voucher.entity";
import { DetailSubDealerDto } from "../dto/detail-sub-dealer.dto";
import { LoginDto } from "src/login/dto/login.dto";

import { PaymentStatus } from "src/product/dto/payment-status.enum";


@Injectable()

export class SubDealerRepository extends Repository<SubDealerEntity> {

    constructor(private dataSource: DataSource) {
        super(SubDealerEntity, dataSource.createEntityManager());
    }

    async getSubDealerData(req: {
        fromDate?: Date; toDate?: Date; paymentStatus?: PaymentStatus, companyCode?: string;
        unitCode?: string
    }) {
        const query = this.createQueryBuilder('sb')
            .select([
                'sb.sub_dealer_id AS SubDealerId',
                'sb.sub_dealer_phone_number AS phoneNumber',
                'sb.name AS name',
                'sb.gst_number AS gstNumber',
                'sb.starting_date AS joiningDate',
                'sb.branch_id AS branch',
            ])
            .leftJoin('sb.voucherId', 'vr')
            .where(`sb.company_code = "${req.companyCode}"`)
            .andWhere(`sb.unit_code = "${req.unitCode}"`)

        // Add conditional filtering based on the provided fromDate and toDate
        if (req.fromDate) {
            query.andWhere('sb.starting_date >= :fromDate', { fromDate: req.fromDate });
        }

        if (req.toDate) {
            query.andWhere('sb.starting_date <= :toDate', { toDate: req.toDate });
        }

        // Add conditional filtering based on paymentStatus
        if (req.paymentStatus) {
            query.andWhere('vr.payment_status = :paymentStatus', { paymentStatus: req.paymentStatus });
        }

        // Execute the query and return the results
        const result = await query.getRawMany();
        return result;
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
                'vr.quantity as quantity',
                'vr.voucher_id AS voucherId',
                'sb.email AS email',
                'sb.address AS address',
                'vr.name AS voucherName',
                'vr.generation_date AS generationDate',
                'vr.product_type AS productType',
            ])
            .leftJoin('sb.voucherId', 'vr')
            .where(`sb.sub_dealer_id='${req.subDealerId}'`)
            .andWhere(`sb.company_code = "${req.companyCode}"`)
            .andWhere(`sb.unit_code = "${req.unitCode}"`)
            .groupBy(`vr.voucher_id `)
            .getRawOne();

        return query;
    }

    async SubDealerLoginDetails(req: LoginDto) {
        const query = this.createQueryBuilder('sf')
            .select(`
                sf.sub_dealer_id AS staffId,
                sf.password AS staffPassword,
                sf.name as staffName,
                pa.permissions AS staffPermissions
            `)
            .leftJoin('sf.permissions', 'pa')
            .where(`sf.sub_dealer_id = :staffId AND sf.password = :staffPassword`, {
                staffId: req.staffId,
                staffPassword: req.password
            })
            .andWhere(`sf.company_code = :companyCode AND sf.unit_code = :unitCode`, {
                companyCode: req.companyCode,
                unitCode: req.unitCode
            })
            .getRawOne();
        return query;
    }
}