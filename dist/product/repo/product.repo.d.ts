import { DataSource, Repository } from "typeorm";
import { ProductEntity } from "../entity/product.entity";
export declare class ProductRepository extends Repository<ProductEntity> {
    private dataSource;
    constructor(dataSource: DataSource);
}
