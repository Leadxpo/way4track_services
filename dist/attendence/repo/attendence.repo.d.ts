import { DataSource, Repository } from "typeorm";
import { AttendanceEntity } from "../entity/attendence.entity";
export declare class AttendenceRepository extends Repository<AttendanceEntity> {
    private dataSource;
    constructor(dataSource: DataSource);
}
