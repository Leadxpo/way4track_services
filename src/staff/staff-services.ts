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

@Injectable()
export class StaffService {
    constructor(
        private adapter: StaffAdapter,
        private staffRepository: StaffRepository,
        private attendanceRepo: AttendenceRepository
    ) { }
    async saveStaffDetails(req: StaffDto): Promise<CommonResponse> {
        try {
            let internalMessage: string;
            let savedStaff;

            if (req.id) {
                const convertDto = this.adapter.convertDtoToEntity(req);
                savedStaff = await this.staffRepository.save(convertDto);
                internalMessage = 'Staff Details Updated Successfully';
            } else {
                const convertDto = this.adapter.convertDtoToEntity(req);
                savedStaff = await this.staffRepository.save(convertDto);
                internalMessage = 'Staff Details Created Successfully';
            }

            let attendance: AttendanceEntity = null;

            if (req.attendanceDetails) {
                attendance = new AttendanceEntity();
                attendance.day = req.attendanceDetails.day;
                attendance.inTime = req.attendanceDetails.inTime;
                attendance.outTime = req.attendanceDetails.outTime;
                attendance.status = req.attendanceDetails.status;
                attendance.staffId = savedStaff;
            
                attendance = await this.attendanceRepo.save(attendance);
            }
            
            savedStaff.attendance = attendance || null;

            await this.staffRepository.save(savedStaff);

            return new CommonResponse(true, 65152, internalMessage);
        } catch (error) {
            throw new ErrorResponse(5416, error.message);
        }
    }



    async deleteStaffDetails(dto: StaffIdDto): Promise<CommonResponse> {
        try {
            const staffExists = await this.staffRepository.findOne({ where: { id: dto.id } });
            if (!staffExists) {
                throw new ErrorResponse(404, `staff with ID ${dto.id} does not exist`);
            }
            await this.staffRepository.delete(dto.id);
            return new CommonResponse(true, 65153, 'staff Details Deleted Successfully');
        } catch (error) {
            throw new ErrorResponse(5417, error.message);
        }
    }

    async getStaffDetails(req: StaffIdDto): Promise<CommonResponse> {
        try {
            const staff = await this.staffRepository.find({
                relations: ['branch'],
                where: { id: req.id },
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
