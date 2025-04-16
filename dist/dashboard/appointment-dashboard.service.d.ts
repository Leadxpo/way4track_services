import { AppointmentRepository } from "src/appointment/repo/appointement.repo";
import { CommonResponse } from "src/models/common-response";
export declare class AppointmentDashboardService {
    private appointmentRepository;
    constructor(appointmentRepository: AppointmentRepository);
    getAllAppointmentDetails(req: {
        unitCode: string;
        companyCode: string;
        branch?: string;
        staffId?: string;
    }): Promise<CommonResponse>;
}
