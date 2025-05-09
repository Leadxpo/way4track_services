import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { BlogEntity } from "../entity/blog.entity";




@Injectable()

export class BlogRepository extends Repository<BlogEntity> {

    constructor(private dataSource: DataSource) {
        super(BlogEntity, dataSource.createEntityManager());
    }


}