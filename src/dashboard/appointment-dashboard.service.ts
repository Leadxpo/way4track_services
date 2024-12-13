
import { Injectable } from "@nestjs/common";
import { AppointmentRepository } from "src/appointment/repo/appointement.repo";
import { CommonResponse } from "src/models/common-response";

@Injectable()
export class AppointmentDashboardService {

    constructor(
        private appointmentRepository: AppointmentRepository,
    ) { }
    async getAllAppointmentDetails(): Promise<CommonResponse> {
        const data = await this.appointmentRepository.getAllAppointmentDetails()
        if (!data) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", data)
        }

    }
}