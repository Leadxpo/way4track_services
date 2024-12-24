import { DataSource, Repository } from "typeorm";
import { AppointmentEntity } from "../entity/appointement.entity";
import { CommonReq } from "src/models/common-req";
export declare class AppointmentRepository extends Repository<AppointmentEntity> {
    private dataSource;
    constructor(dataSource: DataSource);
    getAllAppointmentDetails(req: CommonReq): Promise<{
        groupedBranches: any[];
        appointments: any[];
    }>;
}
