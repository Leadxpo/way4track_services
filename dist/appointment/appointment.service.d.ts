import { AppointmentIdDto } from './dto/appointment-id.dto';
import { CommonResponse } from 'src/models/common-response';
import { AppointmentRepository } from './repo/appointement.repo';
import { AppointmentAdapter } from './appointement.adapter';
import { AppointmentDto } from './dto/appointement.dto';
export declare class AppointmentService {
    private readonly appointmentRepository;
    private readonly appointmentAdapter;
    constructor(appointmentRepository: AppointmentRepository, appointmentAdapter: AppointmentAdapter);
    updateAppointmentDetails(dto: AppointmentDto): Promise<CommonResponse>;
    createAppointmentDetails(dto: AppointmentDto): Promise<CommonResponse>;
    handleAppointmentDetails(dto: AppointmentDto): Promise<CommonResponse>;
    getAppointmentDetails(dto: AppointmentIdDto): Promise<CommonResponse>;
    deleteAppointmentDetails(dto: AppointmentIdDto): Promise<CommonResponse>;
}
