import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ProductTypeEntity } from "../entity/product-type.entity";



@Injectable()

export class ProductTypeRepository extends Repository<ProductTypeEntity> {

    constructor(private dataSource: DataSource) {
        super(ProductTypeEntity, dataSource.createEntityManager());
    }


}