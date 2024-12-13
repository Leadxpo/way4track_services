import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AssertsRepository } from "src/asserts/repo/asserts.repo";
import { CommonResponse } from "src/models/common-response";
import { StaffAttendanceQueryDto } from "src/staff/dto/staff-date.dto";
import { StaffRepository } from "src/staff/repo/staff-repo";

@Injectable()
export class StaffDashboardService {

    constructor(
        @InjectRepository(StaffRepository)
        private staffRepository: StaffRepository,
    ) { }
    async payRoll(): Promise<CommonResponse> {
        const staffData = await this.staffRepository.payRoll()
        if (!staffData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", staffData)
        }
    }

    async staffAttendanceDetails(req: StaffAttendanceQueryDto) {
        const staffData = await this.staffRepository.staffAttendanceDetails(req)
        console.log(staffData, "{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{")
        if (!staffData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", staffData)
        }
    }
}