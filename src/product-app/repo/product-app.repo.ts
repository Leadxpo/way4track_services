import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ProductAppEntity } from "../entity/product-app.entity";




@Injectable()

export class ProductAppRepository extends Repository<ProductAppEntity> {

    constructor(private dataSource: DataSource) {
        super(ProductAppEntity, dataSource.createEntityManager());
    }


}