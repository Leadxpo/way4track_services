import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { VendorEntity } from "../entity/vendor.entity";
import { VendorDetail } from "../dto/vendor-id.deatil";


@Injectable()

export class VendorRepository extends Repository<VendorEntity> {

    constructor(private dataSource: DataSource) {
        super(VendorEntity, dataSource.createEntityManager());
    }

    async getVendorData(req: {
        companyCode?: string,
        unitCode?: string
    }) {
        const query = this.createQueryBuilder('ve')
            .select([
                've.vendor_id AS vendorId',
                've.vendor_phone_number AS phoneNumber',
                've.name AS name',
                've.GST_number AS GSTNumber',
                've.state AS state',
                've.bank_details AS bankDetails',
            ])
            .where(`ve.company_code = "${req.companyCode}"`)
            .andWhere(`ve.unit_code = "${req.unitCode}"`)

        const result = await query.getRawMany();
        return result;
    }


    async getDetailvendorData(req: VendorDetail) {
        const query = await this.createQueryBuilder('ve')
            .select([
                've.vendor_id AS vendorId',
                've.vendor_phone_number AS phoneNumber',
                've.name AS name',
                've.email AS email',
                've.address AS address',
                've.GST_number AS GSTNumber',
                've.state AS state',
                've.bank_details AS bankDetails',
            ])
            .where(`ve.vendor_id = "${req.vendorId}"`)
            .andWhere(`ve.company_code = "${req.companyCode}"`)
            .andWhere(`ve.unit_code = "${req.unitCode}"`)
            .getRawMany();

        return query;
    }
}