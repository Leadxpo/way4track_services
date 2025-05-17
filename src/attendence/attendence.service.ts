import * as XLSX from 'xlsx';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AttendanceEntity } from './entity/attendence.entity';
import { AttendenceRepository } from './repo/attendence.repo';
import { StaffRepository } from 'src/staff/repo/staff-repo';
import { AttendanceStatus } from 'src/staff/enum/attendence-status.enum';
import { CreateAttendanceDto } from './dto/attendence.dto';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { AttendanceAdapter } from './attendence.adapter';
import { CommonReq } from 'src/models/common-req';

@Injectable()
export class AttendanceService {
    constructor(
        private readonly attendanceRepo: AttendenceRepository,
        private readonly adapter: AttendanceAdapter,
        private readonly staffRepo: StaffRepository,
    ) { }

    async processAttendanceExcel(file: Express.Multer.File) {
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        console.log(data, "data")
        const attendanceRecords: AttendanceEntity[] = [];
        const updatedRecords: AttendanceEntity[] = [];
        const missingStaffIds: number[] = [];

        for (const row of data) {
            const staffId = row['Staff ID'];
            const staffName = row['Name'];
            const branchName = row['Branch Name'];
            const monthYear = row['Month-Year']; // Format: "YYYY-MM"

            if (!monthYear) continue;

            const [year, month] = monthYear.split('-').map(Number);
            const daysInMonth = new Date(year, month, 0).getDate();

            // **Check if staff exists**
            const staff = await this.staffRepo.findOne({ where: { staffId } });
            if (!staff) {
                missingStaffIds.push(staffId);
                continue; // Skip this staff ID and proceed with the next row
            }

            for (let day = 1; day <= daysInMonth; day++) {
                const inTimeField = `Day ${day} IN TIME`;
                const inTimeRemarkField = `Day ${day} IN TIME Remarks`;
                const outTimeField = `Day ${day} OUT TIME`;
                const outTimeRemarkField = `Day ${day} OUT TIME Remarks`;
                const statusField = `Day ${day} Status`;
                const remarksField = `Day ${day} Remarks`;

                if (row[inTimeField] || row[outTimeField]) {
                    const date = new Date(year, month - 1, day); // Correct date

                    // **Extract the provided values from Excel**
                    const actualInTime = row[inTimeField] || null;
                    const actualOutTime = row[outTimeField] || null;
                    const inTimeRemark = row[inTimeRemarkField] || null;
                    const outTimeRemark = row[outTimeRemarkField] || null;
                    const status = row[statusField] as AttendanceStatus;
                    const remarks = row[remarksField] || "";

                    // **Check if attendance already exists**
                    const existingRecord = await this.attendanceRepo.findOne({
                        where: { staff: { id: staff.id }, day: date },
                    });

                    if (existingRecord) {
                        // **Update existing record**
                        existingRecord.inTime = actualInTime || existingRecord.inTime;
                        existingRecord.inTimeRemark = inTimeRemark || existingRecord.inTimeRemark;
                        existingRecord.outTime = actualOutTime || existingRecord.outTime;
                        existingRecord.outTimeRemark = outTimeRemark || existingRecord.outTimeRemark;
                        existingRecord.status = status || existingRecord.status;
                        existingRecord.remark = remarks || existingRecord.remark;
                        updatedRecords.push(existingRecord)
                        // await this.attendanceRepo.save(existingRecord);
                    } else {
                        // **Insert new record**
                        const attendance = new AttendanceEntity();
                        attendance.staff = staff;
                        attendance.staffName = staffName;
                        attendance.branchName = branchName;
                        attendance.day = date;
                        attendance.inTime = actualInTime;
                        attendance.inTimeRemark = inTimeRemark;
                        attendance.outTime = actualOutTime;
                        attendance.outTimeRemark = outTimeRemark;
                        attendance.status = status;
                        attendance.remark = remarks;
                        attendanceRecords.push(attendance);
                    }
                }
            }
        }
        if (updatedRecords.length > 0) {
            await this.attendanceRepo.save(updatedRecords);
        }

        if (attendanceRecords.length > 0) {
            await this.attendanceRepo.save(attendanceRecords);
        }
        // console.log(updatedRecords, "updatedRecords")
        return {
            message: 'Attendance data uploaded successfully',
            inserted: attendanceRecords.length,
            missingStaffIds: missingStaffIds.length > 0 ? missingStaffIds : 'None',
            updatedRecords: updatedRecords.length
        };
    }


    async updateAttendanceDetails(dto: CreateAttendanceDto): Promise<CommonResponse> {
        try {
            // Check for Attendance by id or AttendanceId
            let existingAttendance: AttendanceEntity | null = null;

            if (dto.id) {
                existingAttendance = await this.attendanceRepo.findOne({ where: { id: dto.id } });
            }


            if (!existingAttendance) {
                throw new Error('Attendance not found');
            }

            const entity = this.adapter.toEntity(dto);
            console.log(entity, "????????")
            // Merge existing Attendance details with new data
            const updatedAttendance = {
                ...existingAttendance,
                ...entity,
                staff: entity.staff ?? existingAttendance.staff // Preserve staff object
            };


            console.log('Updated Attendance payload:', updatedAttendance); // Debugging step

            await this.attendanceRepo.save(updatedAttendance);


            return new CommonResponse(true, 200, 'Attendance details updated successfully');
        } catch (error) {
            console.error(`Error updating Attendance details: ${error.message}`, error.stack);
            throw new ErrorResponse(500, `Failed to update Attendance details: ${error.message}`);
        }
    }

    async getAttendanceDetailsById(req: CreateAttendanceDto): Promise<CommonResponse> {
        try {
            console.log(req, "+++++++++++")

            const Attendance = await this.attendanceRepo.findOne({ relations: ['staff'], where: { id: req.id } });
            console.log(Attendance, "+++++++++++")

            if (!Attendance) {
                return new CommonResponse(false, 404, 'Attendance not found');
            }
            else {
                // const data = this.AttendanceAdapter.convertEntityToDto([Attendance])
                return new CommonResponse(true, 200, 'Attendance details fetched successfully', Attendance);
            }
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

    async getAttendanceDetails(): Promise<CommonResponse> {
        try {
            const attendanceRecords = await this.attendanceRepo.find({ relations: ['staff'] });

            if (!attendanceRecords.length) {
                return new CommonResponse(false, 404, 'Attendance not found');
            }

            const data = attendanceRecords.map(record => this.adapter.toDto(record));

            return new CommonResponse(true, 200, 'Attendance details fetched successfully', data);
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }


    async getStaffAttendance(req: { staffId?: string; fromDate?: string; toDate?: string; branchName?: string; companyCode?: string; unitCode?: string }): Promise<CommonResponse> {
        const branch = await this.attendanceRepo.getStaffAttendance(req)
        if (!branch.length) {
            return new CommonResponse(false, 35416, "There Is No List");
        } else {
            return new CommonResponse(true, 35416, "Branch List Retrieved Successfully", branch);
        }
    }


}
