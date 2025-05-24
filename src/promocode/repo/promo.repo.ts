import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { PromoEntity } from "../entity/promo.entity";

@Injectable()

export class PromocodesRepository extends Repository<PromoEntity> {

    constructor(private dataSource: DataSource) {
        super(PromoEntity, dataSource.createEntityManager());
    }

    async getPromocodeDetails(req: { promocode?: string; companyCode: string; unitCode: string }) {
        const query = this.createQueryBuilder('promocode')
            .select([
                'promocode.id AS id',
                'promocode.promocode AS promocode',
                'promocode.discount AS discount',
                'promocode.discount_type AS discountType',
                'promocode.min_sale_amount AS minSaleAmount',
                'promocode.max_discount_amount AS maxDiscountAmount',
                'promocode.promo_users AS promoUsers',
                'promocode.company_code AS companyCode',
                'promocode.unit_code AS unitCode',
                'promocode.created_at AS createdAt',
                'promocode.updated_at AS updatedAt',
            ])
            .where('promocode.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('promocode.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.promocode) {
            query.andWhere('promocode.promocode = :promocode', { promocode: req.promocode });
        }

        const result = await query.getRawMany();
        return result;
    }
}