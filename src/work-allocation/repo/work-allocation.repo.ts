import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { WorkAllocationEntity } from "../entity/work-allocation.entity";


@Injectable()

export class WorkAllocationRepository extends Repository<WorkAllocationEntity> {

    constructor(private dataSource: DataSource) {
        super(WorkAllocationEntity, dataSource.createEntityManager());
    }
}