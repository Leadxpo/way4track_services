import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ProductEntity } from "../entity/product.entity";
import { ProductIdDto } from "../dto/product.id.dto";
import { CommonReq } from "src/models/common-req";



@Injectable()

export class ProductRepository extends Repository<ProductEntity> {

    constructor(private dataSource: DataSource) {
        super(ProductEntity, dataSource.createEntityManager());
    }


    async getSearchDetailProduct(req: ProductIdDto) {
        const query = this.createQueryBuilder('pr')
            .select([
                'pr.id AS productId',
                'pr.product_name AS productName',
                'pr.product_description AS productDescription',
                'vendor.name AS vendorName',
                'pr.imei_number AS imeiNumber',
                'pr.location as location',
                'SUM(CASE WHEN pr.status = \'not_assigned\' THEN COALESCE(pr.quantity, 0) ELSE 0 END) AS presentStock',
                'pr.product_status as productStatus'
            ])
            .leftJoin('pr.vendorId', 'vendor')
            .leftJoin('pr.voucherId', 'voucher')
            .where('pr.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('pr.unit_code = :unitCode', { unitCode: req.unitCode });

        if (req.id) {
            query.andWhere('pr.id = :productId', { productId: req.id });
        }

        if (req.productName) {
            query.andWhere('pr.product_name LIKE :productName', { productName: `%${req.productName}%` });
        }

        if (req.location) {
            query.andWhere('pr.location LIKE :location', { location: `%${req.location}%` });
        }

        query.groupBy('pr.id, pr.product_name, pr.product_description, vendor.name, pr.imei_number,pr.location');

        const result = await query.getRawMany();
        // Debugging output
        return result;
    }


    async getDetailProduct(req: CommonReq) {
        console.log('Request Object:', req);
        console.log('Company Code:', req.companyCode);
        console.log('Unit Code:', req.unitCode);

        const query = this.createQueryBuilder('pr')
            .select([
                'pr.product_name AS productName',
                'SUM(pr.quantity) AS presentStock'
            ])
            .where('pr.company_code = :companyCode', { companyCode: req.companyCode })
            .andWhere('pr.unit_code = :unitCode', { unitCode: req.unitCode })
            .groupBy('pr.product_name');

        const result = await query.getRawMany();

        // Return the aggregated results
        return result;
    }




}