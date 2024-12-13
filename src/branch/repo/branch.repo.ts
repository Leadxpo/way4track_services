import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { BranchEntity } from "../entity/branch.entity";


@Injectable()

export class BranchRepository extends Repository<BranchEntity> {

    constructor(private dataSource: DataSource) {
        super(BranchEntity, dataSource.createEntityManager());
    }
}