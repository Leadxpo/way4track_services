import { Injectable } from '@nestjs/common';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { StaffAdapter } from './staff.adaptert';
import { StaffRepository } from './repo/staff-repo';
import { StaffDto } from './dto/staff.dto';
import { StaffIdDto } from './dto/staff-id.dto';
import { join } from 'path';
import { promises as fs } from 'fs';
import { AttendanceEntity } from 'src/attendence/entity/attendence.entity';
import { AttendenceRepository } from 'src/attendence/repo/attendence.repo';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { AttendanceDto } from './dto/attenace-to-staff';
import { StaffEntity } from './entity/staff.entity';

@Injectable()
export class StaffService {
    constructor(
        private adapter: StaffAdapter,
        private staffRepository: StaffRepository,
        private attendanceRepo: AttendenceRepository
    ) { }

    private async saveAttendanceDetails(attendanceDetails: AttendanceDto, staff: StaffEntity, branchId: number) {
        const attendance = new AttendanceEntity();
        attendance.day = attendanceDetails.day;
        attendance.inTime = attendanceDetails.inTime;
        attendance.outTime = attendanceDetails.outTime;
        attendance.status = attendanceDetails.status;
        attendance.staffId = staff;

        const branch = new BranchEntity();
        branch.id = branchId;
        attendance.branchId = branch;

        return await this.attendanceRepo.save(attendance);
    }
    async updateStaffDetails(req: StaffDto): Promise<CommonResponse> {
        try {
            const existingStaff = await this.staffRepository.findOne({
                where: { id: req.id, staffId: req.staffId, companyCode: req.companyCode, unitCode: req.unitCode },
            });

            if (!existingStaff) {
                return new CommonResponse(false, 4002, 'Staff not found for the provided id.');
            }

            Object.assign(existingStaff, this.adapter.convertDtoToEntity(req));
            await this.staffRepository.save(existingStaff);

            if (req.attendanceDetails) {
                const savedAttendance = await this.saveAttendanceDetails(
                    req.attendanceDetails,
                    existingStaff,
                    req.branchId
                );

                if (!existingStaff.attendance) {
                    existingStaff.attendance = [];
                }
                existingStaff.attendance.push(savedAttendance);

                await this.staffRepository.save(existingStaff);
            }

            return new CommonResponse(true, 65152, 'Staff Details Updated Successfully');
        } catch (error) {
            console.error(`Error updating staff details: ${error.message}`, error.stack);
            throw new ErrorResponse(5416, `Failed to update staff details: ${error.message}`);
        }
    }

    async createStaffDetails(req: StaffDto): Promise<CommonResponse> {
        try {
            const newStaff = this.adapter.convertDtoToEntity(req);

            newStaff.staffId = `SF-${(await this.staffRepository.count() + 1).toString().padStart(5, '0')}`;

            await this.staffRepository.save(newStaff);

            if (req.attendanceDetails) {
                const savedAttendance = await this.saveAttendanceDetails(
                    req.attendanceDetails,
                    newStaff,
                    req.branchId
                );
                newStaff.attendance = [savedAttendance];
                await this.staffRepository.save(newStaff);
            }

            return new CommonResponse(true, 65152, 'Staff Details Created Successfully');
        } catch (error) {
            console.error(`Error creating staff details: ${error.message}`, error.stack);
            throw new ErrorResponse(5416, `Failed to create staff details: ${error.message}`);
        }
    }

    async handleStaffDetails(req: StaffDto): Promise<CommonResponse> {
        if (req.id || req.staffId) {
            // If an ID is provided, update the staff details
            return await this.updateStaffDetails(req);
        } else {
            // If no ID is provided, create a new staff record
            return await this.createStaffDetails(req);
        }
    }

    async deleteStaffDetails(dto: StaffIdDto): Promise<CommonResponse> {
        try {
            const staffExists = await this.staffRepository.findOne({ where: { staffId: dto.staffId, companyCode: dto.companyCode, unitCode: dto.unitCode } });
            if (!staffExists) {
                throw new ErrorResponse(404, `staff with staffId ${dto.staffId} does not exist`);
            }
            await this.staffRepository.delete(dto.staffId);
            return new CommonResponse(true, 65153, 'staff Details Deleted Successfully');
        } catch (error) {
            throw new ErrorResponse(5417, error.message);
        }
    }

    async getStaffDetails(req: StaffIdDto): Promise<CommonResponse> {
        try {
            const staff = await this.staffRepository.find({
                relations: ['branch'],
                where: { staffId: req.staffId, companyCode: req.companyCode, unitCode: req.unitCode },
            });

            if (!staff.length) {
                return new CommonResponse(false, 404, 'staff not found');
            } else {
                const data = this.adapter.convertEntityToDto(staff)
                return new CommonResponse(true, 200, 'staff details fetched successfully', data);
            }
        } catch (error) {
            console.error("Error in getstaffDetails service:", error);
            return new CommonResponse(false, 500, 'Error fetching staff details');
        }
    }

    async getStaffNamesDropDown(): Promise<CommonResponse> {
        const data = await this.staffRepository.find({ select: ['name', 'id', 'staffId'] });
        if (data.length) {
            return new CommonResponse(true, 75483, "Data Retrieved Successfully", data)
        } else {
            return new CommonResponse(false, 4579, "There Is No staff names")
        }
    }

    async uploadStaffPhoto(staffId: number, photo: Express.Multer.File): Promise<CommonResponse> {
        try {
            const staff = await this.staffRepository.findOne({ where: { id: staffId } });

            if (!staff) {
                return new CommonResponse(false, 404, 'staff not found');
            }

            const filePath = join(__dirname, '../../uploads/staff_photos', `${staffId}-${Date.now()}.jpg`);
            await fs.writeFile(filePath, photo.buffer);

            staff.staffPhoto = filePath;
            await this.staffRepository.save(staff);

            return new CommonResponse(true, 200, 'Photo uploaded successfully', { photoPath: filePath });
        } catch (error) {
            throw new ErrorResponse(500, error.message);
        }
    }

}
