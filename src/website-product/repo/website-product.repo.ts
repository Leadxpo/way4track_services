import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { WebsiteProductEntity } from "../entity/website-entity";




@Injectable()

export class WebsiteProductRepository extends Repository<WebsiteProductEntity> {

    constructor(private dataSource: DataSource) {
        super(WebsiteProductEntity, dataSource.createEntityManager());
    }


}