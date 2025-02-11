import { Injectable } from '@nestjs/common';
import { AttendenceRepository } from './repo/attendence.repo';
import { BranchRepository } from 'src/branch/repo/branch.repo';
import { StaffRepository } from 'src/staff/repo/staff-repo';
import { CreateAttendanceDto } from './dto/attendence.dto';
import { AttendanceEntity } from './entity/attendence.entity';
import { AttendanceAdapter } from './attendence.adapter';
import { CommonResponse } from 'src/models/common-response';
import { StaffEntity } from 'src/staff/entity/staff.entity';
import { BranchEntity } from 'src/branch/entity/branch.entity';

@Injectable()
export class AttendanceService {
    constructor(
        private attendanceRepository: AttendenceRepository,
        private staffRepository: StaffRepository,
        private adapter: AttendanceAdapter,
        private branchRepository: BranchRepository,
    ) { }
    async saveAttendance(dto: CreateAttendanceDto): Promise<CommonResponse> {
        const { id, staffId, branchId, day, inTime, outTime, status, remarks, companyCode, unitCode } = dto;

        const staff = await this.staffRepository.findOne({ where: { staffId } });
        if (!staff) throw new Error('Staff not found');

        const branch = await this.branchRepository.findOne({ where: { id: branchId } });
        if (!branch) throw new Error('Branch not found');

        let attendance: AttendanceEntity;
        const internalMessage = id ? 'Attendance Updated Successfully' : 'Attendance Created Successfully';

        if (id) {
            attendance = await this.attendanceRepository.findOne({ where: { id } });
            if (!attendance) throw new Error('Attendance record not found');

            attendance.timeRecords = Array.isArray(attendance.timeRecords) ? attendance.timeRecords : [];

            if (inTime && outTime) {
                attendance.timeRecords.push({ inTime, outTime });
            }

            Object.assign(attendance, { status, remarks });
        } else {
            attendance = await this.attendanceRepository.findOne({
                where: { staffId: staff, day, companyCode, unitCode },
            });

            if (attendance) {
                attendance.timeRecords = Array.isArray(attendance.timeRecords) ? attendance.timeRecords : [];

                if (inTime && outTime) {
                    attendance.timeRecords.push({ inTime, outTime });
                }

                Object.assign(attendance, { status, remarks });
            } else {
                attendance = this.adapter.toEntity(dto);
                attendance.staffId = staff;
                attendance.branchId = branch;
                attendance.timeRecords = inTime && outTime ? [{ inTime, outTime }] : [];
            }
        }

        await this.attendanceRepository.save(attendance);

        return new CommonResponse(true, 65152, internalMessage);
    }


    async calculateTotalHours(timeRecords: { inTime: Date; outTime: Date }[]): Promise<number> {
        return timeRecords.reduce((total, record) => {
            const inTime = new Date(record.inTime).getTime();
            const outTime = new Date(record.outTime).getTime();
            return total + (outTime - inTime) / (1000 * 60 * 60); // Convert milliseconds to hours
        }, 0);
    }

    async getAttendance(req: { staffId?: string, branchId?: number, dateRange?: { start: string, end: string }, companyCode?: string, unitCode?: string }): Promise<AttendanceEntity[]> {
        const query = this.attendanceRepository.createQueryBuilder('attendance')
            .leftJoinAndSelect(StaffEntity, 'staff', 'staff.id=attendance.staff_id')
            .leftJoinAndSelect(BranchEntity, 'branch', 'branch.id=attendance.branch_id');
        if (req.staffId) {
            query.andWhere('staff.staff_id = :staffId', { staffId: req.staffId });
        }
        if (req.branchId) {
            query.andWhere('branch.id = :branchId', { branchId: req.branchId });
        }
        if (req.companyCode) {
            query.andWhere('attendance.company_code = :companyCode', { companyCode: req.companyCode });
        }
        if (req.unitCode) {
            query.andWhere('attendance.unit_code = :unitCode', { unitCode: req.unitCode });
        }
        if (req.dateRange) {
            query.andWhere('attendance.day BETWEEN :start AND :end', { start: req.dateRange.start, end: req.dateRange.end });
        }

        return query.getMany();
    }
}