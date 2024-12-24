import { AppointmentRepository } from "src/appointment/repo/appointement.repo";
import { CommonReq } from "src/models/common-req";
import { CommonResponse } from "src/models/common-response";
export declare class AppointmentDashboardService {
    private appointmentRepository;
    constructor(appointmentRepository: AppointmentRepository);
    getAllAppointmentDetails(req: CommonReq): Promise<CommonResponse>;
}
