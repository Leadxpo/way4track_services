import { Injectable } from '@nestjs/common';
import { AttendenceRepository } from './repo/attendence.repo';
import { BranchRepository } from 'src/branch/repo/branch.repo';
import { StaffRepository } from 'src/staff/repo/staff-repo';
import { CreateAttendanceDto } from './dto/attendence.dto';
import { AttendanceEntity } from './entity/attendence.entity';
import { AttendanceAdapter } from './attendence.adapter';
import { CommonResponse } from 'src/models/common-response';

@Injectable()
export class AttendanceService {
    constructor(
        private attendanceRepository: AttendenceRepository,
        private staffRepository: StaffRepository,
        private adapter: AttendanceAdapter,
        private branchRepository: BranchRepository,
    ) { }

    async saveAttendance(dto: CreateAttendanceDto): Promise<CommonResponse> {
        const { id, staffId, branchId, day, inTime, outTime, status, remarks } = dto;

        const staff = await this.staffRepository.findOne({ where: { staffId: staffId } });
        if (!staff) throw new Error('Staff not found');

        const branch = await this.branchRepository.findOne({ where: { id: branchId } });
        if (!branch) throw new Error('Branch not found');

        let attendance: AttendanceEntity;
        const internalMessage = id ? 'Attendance Updated Successfully' : 'Attendance Created Successfully';

        if (id) {
            attendance = await this.attendanceRepository.findOne({ where: { id, companyCode: dto.companyCode, unitCode: dto.unitCode } });
            if (!attendance) throw new Error('Attendance record not found');

            Object.assign(attendance, { staff, branch, day, inTime, outTime, status, remarks });
        } else {
            attendance = this.adapter.toEntity(dto);
            attendance.staffId = staff;
            attendance.branchId = branch;
        }

        await this.attendanceRepository.save(attendance);

        return new CommonResponse(true, 65152, internalMessage);
    }


    async getAttendance(staffId?: number, branchId?: number, dateRange?: { start: string, end: string }, companyCode?: string, unitCode?: string): Promise<AttendanceEntity[]> {
        const query = this.attendanceRepository.createQueryBuilder('attendance')
            .leftJoinAndSelect('attendance.staffId', 'staff')
            .leftJoinAndSelect('attendance.branchId', 'branch');
        if (staffId) {
            query.andWhere('attendance.staffId = :staffId', { staffId });
        }
        if (branchId) {
            query.andWhere('attendance.branchId = :branchId', { branchId });
        }
        if (companyCode) {
            query.andWhere('attendance.company_code = :companyCode', { companyCode });
        }
        if (unitCode) {
            query.andWhere('attendance.unit_code = :unitCode', { unitCode });
        }
        if (dateRange) {
            query.andWhere('attendance.day BETWEEN :start AND :end', { start: dateRange.start, end: dateRange.end });
        }

        return query.getMany();
    }
}