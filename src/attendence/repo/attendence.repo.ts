import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { AttendanceEntity } from "../entity/attendence.entity";


@Injectable()

export class AttendenceRepository extends Repository<AttendanceEntity> {

    constructor(private dataSource: DataSource) {
        super(AttendanceEntity, dataSource.createEntityManager());
    }
}