import { DataSource, Repository } from "typeorm";
import { AppointmentEntity } from "../entity/appointement.entity";
export declare class AppointmentRepository extends Repository<AppointmentEntity> {
    private dataSource;
    constructor(dataSource: DataSource);
    getAllAppointmentDetails(req: {
        unitCode: string;
        companyCode: string;
        branch?: string;
        staffId?: string;
    }): Promise<{
        result: any[];
        appointments: any[];
    }>;
}
