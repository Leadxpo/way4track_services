import { AppointmentService } from './appointment.service';
import { CommonResponse } from 'src/models/common-response';
import { AppointmentIdDto } from './dto/appointment-id.dto';
import { AppointmentDto } from './dto/appointement.dto';
export declare class AppointmentController {
    private readonly appointmentService;
    constructor(appointmentService: AppointmentService);
    handleAppointmentDetails(dto: AppointmentDto): Promise<CommonResponse>;
    deleteAppointmentDetails(dto: AppointmentIdDto): Promise<CommonResponse>;
    getAppointmentDetails(dto: AppointmentIdDto): Promise<CommonResponse>;
}
