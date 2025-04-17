import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { ReviewEntity } from "../entity/reviews-entity";




@Injectable()

export class ReviewRepository extends Repository<ReviewEntity> {

    constructor(private dataSource: DataSource) {
        super(ReviewEntity, dataSource.createEntityManager());
    }


}