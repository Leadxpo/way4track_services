import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AssertsRepository } from "src/asserts/repo/asserts.repo";
import { CommonReq } from "src/models/common-req";
import { CommonResponse } from "src/models/common-response";
import { StaffAttendanceQueryDto } from "src/staff/dto/staff-date.dto";
import { StaffSearchDto } from "src/staff/dto/staff-search.dto";
import { StaffRepository } from "src/staff/repo/staff-repo";

@Injectable()
export class StaffDashboardService {

    constructor(
        @InjectRepository(StaffRepository)
        private staffRepository: StaffRepository,
    ) { }
    async payRoll(req:CommonReq): Promise<CommonResponse> {
        const staffData = await this.staffRepository.payRoll(req)
        if (!staffData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", staffData)
        }
    }

    async staffAttendanceDetails(req: StaffAttendanceQueryDto) {
        const staffData = await this.staffRepository.staffAttendanceDetails(req)
        if (!staffData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", staffData)
        }
    }

    async getStaffSearchDetails(req: StaffSearchDto) {
        const staffData = await this.staffRepository.getStaffSearchDetails(req)
        if (!staffData) {
            return new CommonResponse(false, 56416, "Data Not Found With Given Input", [])
        } else {
            return new CommonResponse(true, 200, "Data retrieved successfully", staffData)
        }
    }
}