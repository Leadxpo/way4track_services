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
import { CommonReq } from 'src/models/common-req';

@Injectable()
export class StaffService {
    constructor(
        private adapter: StaffAdapter,
        private staffRepository: StaffRepository,
        private attendanceRepo: AttendenceRepository
    ) { }

    async handleStaffDetails(req: StaffDto, photo?: Express.Multer.File): Promise<CommonResponse> {
        try {
            let filePath: string | null = null;

            // Handle photo upload
            if (photo) {
                filePath = join(__dirname, '../../uploads/staff_photos', `${Date.now()}-${photo.originalname}`);
                await fs.writeFile(filePath, photo.fieldname); // Save the photo
            }

            if (req.id || req.staffId) {
                // If an ID is provided, update the staff details
                return await this.updateStaffDetails(req, filePath);
            } else {
                // If no ID is provided, create a new staff record
                return await this.createStaffDetails(req, filePath);
            }
        } catch (error) {
            console.error(`Error handling staff details: ${error.message}`, error.stack);
            throw new ErrorResponse(5416, `Failed to handle staff details: ${error.message}`);
        }
    }

    async createStaffDetails(req: StaffDto, filePath: string | null): Promise<CommonResponse> {
        try {
            const newStaff = this.adapter.convertDtoToEntity(req);
            console.log(req, "+++++++++++")
            newStaff.staffId = `SF-${(await this.staffRepository.count() + 1).toString().padStart(5, '0')}`;
            if (filePath) {
                newStaff.staffPhoto = filePath;
            }
            await this.staffRepository.insert(newStaff);
            // await this.staffRepository.save(newStaff);
            return new CommonResponse(true, 65152, 'Staff Details Created Successfully');
        } catch (error) {
            console.error(`Error creating staff details: ${error.message}`, error.stack);
            throw new ErrorResponse(5416, `Failed to create staff details: ${error.message}`);
        }
    }

    async updateStaffDetails(req: StaffDto, filePath: string | null): Promise<CommonResponse> {
        try {
            const existingStaff = await this.staffRepository.findOne({
                where: { id: req.id, staffId: req.staffId, companyCode: req.companyCode, unitCode: req.unitCode },
            });

            if (!existingStaff) {
                return new CommonResponse(false, 4002, 'Staff not found for the provided ID.');
            }
            console.log('Existing Staff:', existingStaff);
            const staffEntity = this.adapter.convertDtoToEntity(req);
            console.log('Converted Entity:', staffEntity);
            Object.assign(existingStaff, staffEntity);
            if (filePath) {
                existingStaff.staffPhoto = filePath;
            }

            await this.staffRepository.save(existingStaff);
            return new CommonResponse(true, 65152, 'Staff Details Updated Successfully');
        } catch (error) {
            console.error(`Error updating staff details: ${error.message}`, error.stack);
            throw new ErrorResponse(5416, `Failed to update staff details: ${error.message}`);
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


    async getStaffDetails(req: CommonReq): Promise<CommonResponse> {
        const branch = await this.staffRepository.find({
            where: { companyCode: req.companyCode, unitCode: req.unitCode }, relations: ['branch']
        });
        if (!branch.length) {
            return new CommonResponse(false, 35416, "There Is No List");
        } else {
            return new CommonResponse(true, 35416, "Branch List Retrieved Successfully", branch);
        }
    }

    async getStaffDetailsById(req: StaffIdDto): Promise<CommonResponse> {
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
}
