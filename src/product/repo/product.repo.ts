import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ProductEntity } from "../entity/product.entity";
import { ProductIdDto } from "../dto/product.id.dto";



@Injectable()

export class ProductRepository extends Repository<ProductEntity> {

    constructor(private dataSource: DataSource) {
        super(ProductEntity, dataSource.createEntityManager());
    }
    async getSearchDetailProduct(req: ProductIdDto) {
        const query = this.createQueryBuilder('pr')
            .leftJoinAndSelect('pr.vendorId', 'vendor')
            .leftJoinAndSelect('pr.voucherId', 'voucher')
            .where('pr.companyCode = :companyCode', { companyCode: req.companyCode })
            .andWhere('pr.unitCode = :unitCode', { unitCode: req.unitCode });

        if (req.id) {
            query.andWhere('pr.id = :productId', { productId: req.id });
        }

        if (req.productName) {
            query.andWhere('pr.productName LIKE :productName', { productName: `%${req.productName}%` });
        }

        if (req.location) {
            query.andWhere('pr.location LIKE :location', { location: `%${req.location}%` });
        }
        const result = await query.getMany();
        return result;
    }


}