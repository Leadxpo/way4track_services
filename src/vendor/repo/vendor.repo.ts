import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { VendorEntity } from "../entity/vendor.entity";
import { VoucherEntity } from "src/voucher/entity/voucher.entity";
import { VendorDetail } from "../dto/vendor-id.deatil";


@Injectable()

export class VendorRepository extends Repository<VendorEntity> {

    constructor(private dataSource: DataSource) {
        super(VendorEntity, dataSource.createEntityManager());
    }

    async getVendorData(req: {
        fromDate?: Date; toDate?: Date; paymentStatus?: string; companyCode?: string,
        unitCode?: string
    }) {
        const query = this.createQueryBuilder('ve')
            .select([
                've.vendor_id AS vendorId',
                've.vendor_phone_number AS phoneNumber',
                've.name AS name',
                've.starting_date AS joiningDate',
                'vr.payment_status AS paymentStatus',
                'vr.amount AS amount',
                'vr.voucher_id as voucherId',
            ])
            .leftJoin('ve.voucher_id', 'vr')
            .where(`ve.company_code = "${req.companyCode}"`)
            .andWhere(`ve.unit_code = "${req.unitCode}"`)

        if (req.fromDate) {
            query.andWhere('ve.starting_date >= :fromDate', { fromDate: req.fromDate });
        }

        if (req.toDate) {
            query.andWhere('ve.starting_date <= :toDate', { toDate: req.toDate });
        }

        if (req.paymentStatus) {
            query.andWhere('vr.payment_status = :paymentStatus', { paymentStatus: req.paymentStatus });
        }

        const result = await query.getRawMany();
        return result;
    }


    async getDetailvendorData(req: VendorDetail) {
        const query = await this.createQueryBuilder('ve')
            .select([
                've.vendor_id AS vendorId',
                've.vendor_phone_number AS phoneNumber',
                've.name AS name',
                've.starting_date AS joiningDate',
                'vr.payment_status AS paymentStatus',
                'vr.amount AS amount',
                'vr.voucher_id AS voucherId',
                've.email AS email',
                've.address AS address',
                'vr.name AS voucherName',
                'vr.generation_date AS generationDate',
                've.product_type AS productType',
            ])
            .leftJoin('ve.voucher_id', 'vr')
            .where(`ve.vendor_id = "${req.vendorId}"`)
            .andWhere(`ve.company_code = "${req.companyCode}"`)
            .andWhere(`ve.unit_code = "${req.unitCode}"`)
            .getRawOne();

        return query;
    }
}