import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { AttendenceRepository } from 'src/attendence/repo/attendence.repo';
import { LoginDto } from 'src/login/dto/login.dto';
import { CommonReq } from 'src/models/common-req';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { StaffIdDto } from './dto/staff-id.dto';
import { StaffDto } from './dto/staff.dto';
import { StaffEntity } from './entity/staff.entity';
import { StaffRepository } from './repo/staff-repo';
import { StaffAdapter } from './staff.adaptert';
import { PermissionsDto } from 'src/permissions/dto/permissions.dto';
import { PermissionsService } from 'src/permissions/permissions.services';
import { BranchEntity } from 'src/branch/entity/branch.entity';


@Injectable()
export class StaffService {
    private storage: Storage;
    private bucketName: string;
    constructor(
        private adapter: StaffAdapter,
        private staffRepository: StaffRepository,
        private attendanceRepo: AttendenceRepository,
        private service: PermissionsService
    ) {
        this.storage = new Storage({
            projectId: process.env.GCLOUD_PROJECT_ID ||
                'sharontelematics-1530044111318',
            keyFilename: process.env.GCLOUD_KEY_FILE || 'sharontelematics-1530044111318-0b877bc770fc.json',
        });

        this.bucketName = process.env.GCLOUD_BUCKET_NAME || 'way4track-application';
    }

    async handleStaffDetails(req: StaffDto, photo?: Express.Multer.File): Promise<CommonResponse> {
        try {
            let filePath: string | null = null;

            // Handle photo upload
            if (photo) {
                const bucket = this.storage.bucket(this.bucketName);
                const uniqueFileName = `staff_photos/${Date.now()}-${photo.originalname}`;
                const file = bucket.file(uniqueFileName);

                await file.save(photo.buffer, {
                    contentType: photo.mimetype,
                    resumable: false,
                });

                console.log(`File uploaded to GCS: ${uniqueFileName}`);
                filePath = `https://storage.googleapis.com/${this.bucketName}/${uniqueFileName}`;
            }

            // 🔍 Step 1: Check if staff record already exists
            // const existingStaff = await this.staffRepository.findOne({
            //     where: [{ id: req.id }, { staffId: req.staffId }],
            // });

            if (req.id) {
                console.log("🔄 Updating existing staff record...");
                return await this.updateStaffDetails(req, filePath);
            } else {
                console.log("🆕 Creating a new staff record...");
                return await this.createStaffDetails(req, filePath);
            }
        } catch (error) {
            console.error(`❌ Error handling staff details: ${error.message}`, error.stack);
            throw new ErrorResponse(5416, `Failed to handle staff details: ${error.message}`);
        }
    }


    async createStaffDetails(req: StaffDto, filePath: string | null): Promise<CommonResponse> {
        try {
            console.log(req, "req");

            // Convert DTO to entity
            const newStaff = this.adapter.convertDtoToEntity(req);

            // Generate staffId
            newStaff.staffId = `SF-${(await this.staffRepository.count() + 1).toString().padStart(5, '0')}`;

            // Assign staff photo if provided
            if (filePath) {
                newStaff.staffPhoto = filePath;
            }

            console.log(newStaff, "new");

            // Save new staff
            await this.staffRepository.insert(newStaff);

            // **Create default permissions for the new staff**
            const permissionsDto: PermissionsDto = {
                staffId: newStaff.staffId,
                // permissions: this.getDefaultPermissions(req.designation),
                companyCode: req.companyCode,
                unitCode: req.unitCode // Fetch default permissions
            };

            await this.service.savePermissionDetails(permissionsDto);

            return new CommonResponse(true, 65152, 'Staff Details and Permissions Created Successfully');
        } catch (error) {
            console.error(`Error creating staff details: ${error.message}`, error.stack);
            throw new ErrorResponse(5416, `Failed to create staff details: ${error.message}`);
        }
    }


    async updateStaffDetails(req: StaffDto, filePath: string | null): Promise<CommonResponse> {
        try {
            let existingStaff: StaffEntity | null = null;

            if (req.id) {
                existingStaff = await this.staffRepository.findOne({
                    where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode }
                });
            } else if (req.staffId) {
                existingStaff = await this.staffRepository.findOne({
                    where: { staffId: req.staffId, companyCode: req.companyCode, unitCode: req.unitCode }
                });
            }

            if (!existingStaff) {
                return new CommonResponse(false, 4002, 'Staff not found for the provided ID.');
            }

            // ✅ Delete old file only if a new one is uploaded
            if (filePath && existingStaff.staffPhoto) {
                const existingFilePath = existingStaff.staffPhoto.replace(`https://storage.googleapis.com/${this.bucketName}/`, '');
                const file = this.storage.bucket(this.bucketName).file(existingFilePath);

                try {
                    await file.delete();
                    console.log(`Deleted old file from GCS: ${existingFilePath}`);
                } catch (error) {
                    console.error(`Error deleting old file from GCS: ${error.message}`);
                }
            }
            const staffEntity = this.adapter.convertDtoToEntity(req);
            const updatedStaff = {
                ...existingStaff,
                ...staffEntity,
                id: existingStaff.id,  // 🔴 Ensure ID is retained to prevent insert!
                staffPhoto: filePath || existingStaff.staffPhoto, // ✅ Keep old photo if no new one is uploaded
            };

            await this.staffRepository.update(existingStaff.id, updatedStaff);
            // ✅ Merge the updates, keeping the old photo if none is provided


            // await this.staffRepository.save(updatedStaff);
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
            where: { companyCode: req.companyCode, unitCode: req.unitCode }, relations: ['branch', 'voucherId']
        });
        if (!branch.length) {
            return new CommonResponse(false, 35416, "There Is No List");
        } else {
            return new CommonResponse(true, 35416, "Branch List Retrieved Successfully", branch);
        }
    }

    async getStaffDetailsById(req: StaffIdDto): Promise<CommonResponse> {
        try {
            const staff = await this.staffRepository.createQueryBuilder('staff')
                .leftJoinAndSelect(BranchEntity, 'branch', 'branch.id = staff.branch_id')
                .leftJoinAndSelect('staff.voucherId', 'voucher')
                .leftJoinAndSelect('staff.staffFrom', 'staffFrom')
                .leftJoinAndSelect('staff.staffTo', 'staffTo')
                .leftJoinAndSelect('staff.request', 'request')
                .leftJoinAndSelect('staff.productAssign', 'productAssign')
                .where('staff.staffId = :staffId', { staffId: req.staffId })
                .andWhere('staff.companyCode = :companyCode', { companyCode: req.companyCode })
                .andWhere('staff.unitCode = :unitCode', { unitCode: req.unitCode })
                .getOne();

            if (!staff) {
                return new CommonResponse(false, 404, 'Staff not found');
            }
            console.log(staff);  // Log the result before conversion to DTO

            // const data = this.adapter.convertEntityToDto([staff]);
            // console.log(data);  // Log the result before conversion to DTO

            return new CommonResponse(true, 200, 'Staff details fetched successfully', staff);
        } catch (error) {
            console.error("Error in getStaffDetailsById service:", error);
            return new CommonResponse(false, 500, 'Error fetching staff details');
        }
    }


    async getStaffProfileDetails(req: LoginDto): Promise<CommonResponse> {
        try {
            const staff = await this.staffRepository.find({
                relations: ['branch', 'voucherId', 'notifications', 'permissions'],
                where: {
                    staffId: req.staffId, password: req.password,
                    designation: req.designation, companyCode: req.companyCode, unitCode: req.unitCode
                },
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
        const data = await this.staffRepository.find({ select: ['name', 'id', 'staffId', 'designation'], relations: ['branch'] });
        if (data.length) {
            return new CommonResponse(true, 75483, "Data Retrieved Successfully", data)
        } else {
            return new CommonResponse(false, 4579, "There Is No staff names")
        }
    }
}
