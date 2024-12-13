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

    async getvendorData() {
        const query = await this.createQueryBuilder('ve')
            .select([
                've.vendor_id AS vendorId',
                've.vendor_phone_number AS phoneNumber',
                've.name AS name',
                've.starting_date AS joiningDate',
                'vr.payment_status AS paymentStatus',
                'vr.amount AS amount',
                'vr.voucher_id as voucherId',
            ])
            .leftJoin(VoucherEntity, 'vr', 'vr.id = ve.voucher_id')
            .getRawMany();
        return query;
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
            .leftJoin(VoucherEntity, 'vr', 'vr.id = ve.voucher_id')
            .where(`ve.vendor_id = "${req.vendorId}"`)
            .getRawOne();

        return query;
    }
}