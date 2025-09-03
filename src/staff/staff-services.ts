import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { AttendenceRepository } from 'src/attendence/repo/attendence.repo';
import { LoginDto } from 'src/login/dto/login.dto';
import { CommonReq } from 'src/models/common-req';
import { CommonResponse } from 'src/models/common-response';
import { ErrorResponse } from 'src/models/error-response';
import { StaffIdDto } from './dto/staff-id.dto';
import { Experience, Qualifications, StaffDto } from './dto/staff.dto';
import { Qualification, StaffEntity } from './entity/staff.entity';
import { StaffRepository } from './repo/staff-repo';
import { StaffAdapter } from './staff.adaptert';
import { PermissionsDto } from 'src/permissions/dto/permissions.dto';
import { PermissionsService } from 'src/permissions/permissions.services';
import { BranchEntity } from 'src/branch/entity/branch.entity';
import { LettersDto } from 'src/letters/dto/letters.dto';
import { LettersService } from 'src/letters/letters.service';
import { LettersRepository } from 'src/letters/repo/letters.repo';
import { LettersEntity } from 'src/letters/entity/letters.entity';
import { DesignationRepository } from 'src/designation/repo/designation.repo';
import { Letters } from './enum/qualifications.enum';
import { StaffStatus } from './enum/staff-status';


@Injectable()
export class StaffService {
    private storage: Storage;
    private bucketName: string;
    constructor(
        private adapter: StaffAdapter,
        private staffRepository: StaffRepository,
        private attendanceRepo: AttendenceRepository,
        private service: PermissionsService,
        private lettersService: LettersService,
        private letterRepo: LettersRepository,
        private designationRepository: DesignationRepository
    ) {
        this.storage = new Storage({
            projectId: process.env.GCLOUD_PROJECT_ID ||
                'sharontelematics-1530044111318',
            keyFilename: process.env.GCLOUD_KEY_FILE || 'sharontelematics-1530044111318-0b877bc770fc.json',
        });

        this.bucketName = process.env.GCLOUD_BUCKET_NAME || 'way4track-application';
    }

    async handleStaffDetails(req: StaffDto, files?: any): Promise<CommonResponse> {
        try {

            if (req.id) {
                console.log("🔄 Updating existing staff record...");
                return await this.updateStaffDetails(req, files);
            } else {
                console.log("🆕 Creating a new staff record...");
                return await this.createStaffDetails(req, files);
            }
        } catch (error) {
            console.error(`❌ Error handling staff details: ${error.message}`, error.stack);
            throw new ErrorResponse(5416, `Failed to handle staff details: ${error.message}`);
        }
    }


    async createStaffDetails(req: StaffDto, files?: any): Promise<CommonResponse> {
        try {
            const newStaff = this.adapter.convertDtoToEntity(req);
            console.log(req, "req");

            // Fetch DesignationEntity based on designation_id
            let designationEntity = null;
            if (req.designation_id) {
                designationEntity = await this.designationRepository.findOne({
                    where: { id: req.designation_id }
                });

                if (!designationEntity) {
                    throw new Error(`Designation with ID '${req.designation_id}' not found.`);
                }
                console.log(designationEntity, 'designationEntity');

                newStaff.designation = designationEntity.designation;
                newStaff.designationRelation = designationEntity; // Store relation
            }

            // Generate Staff ID
            // newStaff.staffId = `SF-${(await this.staffRepository.count() + 1).toString().padStart(5, '0')}`;

            // Upload Staff Photo
            if (files?.photo?.[0]) {
                newStaff.staffPhoto = await this.uploadFile(files.photo[0], `staff_photos/${newStaff.staffId}.jpg`);
            }

            // Upload Vehicle Photo
            if (files?.vehiclePhoto?.[0]) {
                newStaff.vehiclePhoto = await this.uploadFile(files.vehiclePhoto[0], `vehicle_photos/${newStaff.staffId}.jpg`);
            }

            // Upload Resume
            if (files?.resume?.[0]) {
                newStaff.resume = await this.uploadFile(files.resume[0], `resume/${newStaff.staffId}.jpg`);
            }

            // Handle Qualifications and Qualification Files
            let qualifications: Qualifications[] = [];

            if (typeof req.qualifications === 'string') {
                try {
                    qualifications = JSON.parse(req.qualifications);
                } catch (e) {
                    console.error("Invalid JSON in qualifications:", req.qualifications);
                    qualifications = [];
                }
            } else if (Array.isArray(req.qualifications)) {
                qualifications = [...req.qualifications];
            }

            let experience: Experience[] = [];

            if (typeof req.experienceDetails === 'string') {
                try {
                    experience = JSON.parse(req.experienceDetails);
                } catch (e) {
                    console.error("Invalid JSON in experienceDetails:", req.experienceDetails);
                    experience = [];
                }
            } else if (Array.isArray(req.experienceDetails)) {
                experience = [...req.experienceDetails];
            }



            if (files?.qualificationFiles) {
                for (let i = 0; i < files.qualificationFiles.length; i++) {
                    const file = files.qualificationFiles[i];
                    const filePath = await this.uploadFile(file, `qualification_files/${newStaff.staffId}_${file.originalname}`);

                    if (qualifications[i]) {
                        qualifications[i].file = filePath;
                    } else {
                        console.warn(`No matching qualification found for file: ${file.originalname}. Adding default entry.`);
                        qualifications.push({
                            qualificationName: '',
                            marksOrCgpa: null,
                            file: filePath
                        });
                    }
                }
            }
            console.log(qualifications, "qualifications")

            if (files?.experience) {
                for (let i = 0; i < files.experience.length; i++) {
                    const file = files.experience[i];
                    const filePath = await this.uploadFile(file, `experience_files/${newStaff.staffId}_${file.originalname}`);

                    // Ensure experience[i] exists or push a new one
                    if (experience[i]) {
                        experience[i].uploadLetters = filePath;
                    } else {
                        experience.push({
                            previousCompany: '',
                            previous_designation: '',
                            total_experience: '',
                            previous_salary: '',
                            letter: Letters.OFFER_LETTER, // Adjust as needed
                            uploadLetters: filePath,
                        });
                    }
                }
            }
            console.log(experience, "experience")


            newStaff.qualifications = qualifications;
            newStaff.experienceDetails = experience;

            // Save Staff Record
            await this.staffRepository.save(newStaff);

            // Assign Permissions
            const permissionsDto: PermissionsDto = {
                staffId: newStaff.staffId,
                companyCode: req.companyCode,
                unitCode: req.unitCode
            };
            console.log(permissionsDto, "><<<<<<<<<<<");
            await this.service.savePermissionDetails(permissionsDto);

            // Upload Letter Documents
            // const lettersDto: LettersDto = {
            //     staffId: newStaff.staffId,
            //     companyCode: req.companyCode,
            //     unitCode: req.unitCode,
            //     offerLetter: files?.offerLetter?.[0] ? await this.uploadFile(files.offerLetter[0], `letters/${newStaff.staffId}_offer.pdf`) : null,
            //     resignationLetter: files?.resignationLetter?.[0] ? await this.uploadFile(files.resignationLetter[0], `letters/${newStaff.staffId}_resignation.pdf`) : null,
            //     terminationLetter: files?.terminationLetter?.[0] ? await this.uploadFile(files.terminationLetter[0], `letters/${newStaff.staffId}_termination.pdf`) : null,
            //     appointmentLetter: files?.appointmentLetter?.[0] ? await this.uploadFile(files.appointmentLetter[0], `letters/${newStaff.staffId}_appointment.pdf`) : null,
            //     leaveFormat: files?.leaveFormat?.[0] ? await this.uploadFile(files.leaveFormat[0], `letters/${newStaff.staffId}_leave.pdf`) : null,
            //     relievingLetter: files?.relievingLetter?.[0] ? await this.uploadFile(files.relievingLetter[0], `letters/${newStaff.staffId}_relieving.pdf`) : null,
            //     experienceLetter: files?.experienceLetter?.[0] ? await this.uploadFile(files.experienceLetter[0], `letters/${newStaff.staffId}_experience.pdf`) : null
            // };
            // console.log(lettersDto, "=====<<<<");

            // await this.lettersService.saveLetterDetails(lettersDto);

            return new CommonResponse(true, 65152, 'Staff Details and Permissions Created Successfully');
        } catch (error) {
            console.error('Error saving staff details:', error);

            // Handle TypeORM QueryFailedError (e.g., unique constraint, null value, etc.)
            const code = error.driverError?.code;
            let errorMessage = 'Database error occurred.';
            let field = '';

            switch (code) {
                case '23505': // unique_violation
                    field = error.driverError.detail?.match(/\(([^)]+)\)/)?.[1] || '';
                    errorMessage = 'Duplicate entry found.';
                    break;
                case '23502': // not_null_violation
                    field = error.driverError.column || '';
                    errorMessage = 'A required field is missing.';
                    break;
                case '23503': // foreign_key_violation
                    field = error.driverError.constraint || '';
                    errorMessage = 'Invalid reference to another table.';
                    break;
            }

            throw new ErrorResponse(400, `${errorMessage} ${field ? 'Field: ' + field : ''}`);
        }

    }



    async updateStaffDetails(req: StaffDto, files?: any): Promise<CommonResponse> {
        try {
            let existingStaff: StaffEntity | null = await this.staffRepository.findOne({
                where: { id: req.id, companyCode: req.companyCode, unitCode: req.unitCode },
                relations: ['designationRelation']
            });

            if (!existingStaff) {
                return new CommonResponse(false, 4002, 'Staff not found for the provided ID.');
            }
            // Check if designation has changed
            if (req.designation_id) {
                const designationChanged = existingStaff.designationRelation?.id !== req.designation_id;
                if (designationChanged) {
                    const permissionsDto: PermissionsDto = {
                        staffId: existingStaff.staffId,
                        companyCode: req.companyCode,
                        unitCode: req.unitCode
                    };

                    await this.service.updatePermissionDetails(permissionsDto);
                }
                console.log(designationChanged, "designationChanged")
            }




            // Update staff details
            const updatedStaff: Partial<StaffEntity> = {
                ...existingStaff,
                ...this.adapter.convertDtoToEntity(req)
            };
            // Handle designation change


            if (files?.photo?.[0]) {
                if (existingStaff.staffPhoto) {
                    await this.deleteFile(existingStaff.staffPhoto);
                }
                updatedStaff.staffPhoto = await this.uploadFile(files.photo[0], `staff_photos/${existingStaff.staffId}.jpg`);
            }

            if (files?.vehiclePhoto?.[0]) {
                if (existingStaff.vehiclePhoto) {
                    await this.deleteFile(existingStaff.vehiclePhoto);
                }
                updatedStaff.vehiclePhoto = await this.uploadFile(files.vehiclePhoto[0], `vehicle_photos/${existingStaff.staffId}.jpg`);
            }

            if (files?.resume?.[0]) {
                if (existingStaff.resume) {
                    await this.deleteFile(existingStaff.resume)
                }
                updatedStaff.resume = await this.uploadFile(files.resume[0], `resume/${existingStaff.resume}.jpg`)
            }
            let newQualifications: Qualifications[] = [];
            let newExperiences: Experience[] = [];
            console.log('New Qualifications:', newQualifications);

            if (typeof req.qualifications === 'string') {
                try {
                    newQualifications = JSON.parse(req.qualifications);
                } catch (e) {
                    console.error("Invalid qualifications JSON");
                }
            } else if (Array.isArray(req.qualifications)) {
                newQualifications = [...req.qualifications];
            }

            if (typeof req.experienceDetails === 'string') {
                try {
                    newExperiences = JSON.parse(req.experienceDetails);
                } catch (e) {
                    console.error("Invalid experienceDetails JSON");
                }
            } else if (Array.isArray(req.experienceDetails)) {
                newExperiences = [...req.experienceDetails];
            }
            const mergedQualifications: Qualifications[] = [...(existingStaff.qualifications || [])];


            for (const [index, item] of newQualifications.entries()) {
                const file = files?.qualificationFiles?.[index];
                const filePath = file ? await this.uploadFile(file, `qualification_files/${existingStaff.staffId}_${file.originalname}`) : null;
                const qualificationData = {
                    qualificationName: item.qualificationName || '',
                    marksOrCgpa: item.marksOrCgpa !== undefined ? item.marksOrCgpa : null, // Ensure it's properly assigned
                };

                if (mergedQualifications[index]) {
                    mergedQualifications[index] = {
                        ...mergedQualifications[index],
                        ...qualificationData,
                        file: filePath || mergedQualifications[index].file
                    };
                } else {
                    mergedQualifications.push({
                        ...qualificationData,
                        file: filePath
                    });
                }
            }
            updatedStaff.qualifications = mergedQualifications;
            console.log('Merged Qualifications:', mergedQualifications);


            const mergedExperience: Experience[] = [...(existingStaff.experienceDetails || [])];

            for (const [index, item] of newExperiences.entries()) {
                const file = files?.experience?.[index];
                const filePath = file ? await this.uploadFile(file, `experience_files/${existingStaff.staffId}_${file.originalname}`) : null;

                if (mergedExperience[index]) {
                    mergedExperience[index] = {
                        ...mergedExperience[index],
                        ...item,
                        uploadLetters: filePath || mergedExperience[index].uploadLetters
                    };
                } else {
                    mergedExperience.push({
                        ...item,
                        uploadLetters: filePath
                    });
                }
            }


            updatedStaff.experienceDetails = mergedExperience
            await this.staffRepository.update(existingStaff.id, updatedStaff);
            return new CommonResponse(true, 65152, 'Staff Details Updated Successfully');
        } catch (error) {
            console.error('Error saving staff details:', error);

            // Handle TypeORM QueryFailedError (e.g., unique constraint, null value, etc.)
            const code = error.driverError?.code;
            let errorMessage = 'Database error occurred.';
            let field = '';

            switch (code) {
                case '23505': // unique_violation
                    field = error.driverError.detail?.match(/\(([^)]+)\)/)?.[1] || '';
                    errorMessage = 'Duplicate entry found.';
                    break;
                case '23502': // not_null_violation
                    field = error.driverError.column || '';
                    errorMessage = 'A required field is missing.';
                    break;
                case '23503': // foreign_key_violation
                    field = error.driverError.constraint || '';
                    errorMessage = 'Invalid reference to another table.';
                    break;
            }

            throw new ErrorResponse(400, `${errorMessage} ${field ? 'Field: ' + field : ''}`);
        }

    }


    async deleteFile(fileUrl: string): Promise<void> {
        try {
            const existingFilePath = fileUrl.replace(`https://storage.googleapis.com/${this.bucketName}/`, '');
            const file = this.storage.bucket(this.bucketName).file(existingFilePath);
            await file.delete();
            console.log(`Deleted old file from GCS: ${existingFilePath}`);
        } catch (error) {
            console.error(`Error deleting old file from GCS: ${error.message}`);
        }
    }


    private async uploadFile(file: Express.Multer.File, fileName: string): Promise<string> {
        const bucket = this.storage.bucket(this.bucketName);
        const fileRef = bucket.file(fileName);

        await fileRef.save(file.buffer, {
            contentType: file.mimetype,
            resumable: false,
        });

        console.log(`File uploaded to GCS: ${fileName}`);
        return `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
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
            where: { companyCode: req.companyCode, unitCode: req.unitCode },
            relations: ['branch']
        });

        const staffDtos = this.adapter.convertEntityToDto(branch);

        if (staffDtos.length === 0) {
            return new CommonResponse(false, 35416, "There Is No List");
        }

        return new CommonResponse(true, 35416, "Branch List Retrieved Successfully", staffDtos);
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
                .leftJoinAndSelect('staff.permissions', 'permissions')
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

    // async getStaffProfileDetails(req: LoginDto): Promise<CommonResponse> {
    //     try {
    //         let staff;
    //         let device;
    //         if (req.uniqueId) {
    //             device = await this.staffRepository.findOne({
    //                 where: {
    //                     uniqueId: req.uniqueId
    //                 },
    //             });
    //             if (device) {
    //                 staff = await this.staffRepository.findOne({
    //                     where: {
    //                         staffId: req.staffId,
    //                         password: req.password,
    //                         companyCode: req.companyCode,
    //                         unitCode: req.unitCode,
    //                         designation: req.designation,
    //                         uniqueId: device.uniqueId // Fix: Compare by designation name
    //                     },
    //                 });
    //             } else {
    //                 await this.staffRepository.save({ uniqueId: req.uniqueId })
    //             }
    //         } else {
    //             return new CommonResponse(false, 404, 'device id not given');
    //         }



    //         if (!staff) {
    //             return new CommonResponse(false, 404, 'Invalid credentials');
    //         }

    //         if (staff.status !== StaffStatus.ACTIVE) {
    //             return new CommonResponse(false, 403, 'Staff is not active');
    //         }


    //         return new CommonResponse(true, 200, 'Staff details fetched successfully', staff);
    //     } catch (error) {
    //         console.error("Error in getStaffProfileDetails service:", error);
    //         return new CommonResponse(false, 500, 'Error fetching staff details');
    //     }
    // }

    async getStaffProfileDetails(req: LoginDto): Promise<CommonResponse> {
        try {
            // if (!req.uniqueId) {
            //     return new CommonResponse(false, 404, 'Device ID not provided');
            // }

            // Step 1: Check if any staff already has this device ID
            // const device = await this.staffRepository.findOne({
            //     where: { uniqueId: req.uniqueId },
            // });

            // Step 2: Try to find the staff with provided credentials (without checking uniqueId yet)
            const staff = await this.staffRepository.findOne({
                where: {
                    staffId: req.staffId,
                    password: req.password,
                    companyCode: req.companyCode,
                    unitCode: req.unitCode,
                    designation: req.designation, // Optional: remove if not part of login
                }, relations: ['branch', 'permissions']
            });

            if (!staff) {
                return new CommonResponse(false, 404, 'Invalid credentials');
            }

            // Step 3: If device not recognized, and staff has no uniqueId, assign this one
            // if (!device && !staff.uniqueId) {
            //     staff.uniqueId = req.uniqueId;
            //     await this.staffRepository.save(staff); // Save the updated staff
            // }

            // Step 4: Check if the staff trying to log in matches the device
            // if (staff.uniqueId !== req.uniqueId) {
            //     return new CommonResponse(false, 404, 'Device not recognized for this staff');
            // }

            if (staff.status !== StaffStatus.ACTIVE) {
                return new CommonResponse(false, 403, 'Staff is not active');
            }

            return new CommonResponse(true, 200, 'Staff details fetched successfully', staff);
        } catch (error) {
            console.error("Error in getStaffProfileDetails service:", error);
            return new CommonResponse(false, 500, 'Error fetching staff details');
        }
    }


    async getStaffNamesDropDown(): Promise<CommonResponse> {
        const data = await this.staffRepository.find({ select: ['name', 'id', 'staffId'], relations: ['designationRelation'],where:{status:StaffStatus.ACTIVE} });
        if (data.length) {
            return new CommonResponse(true, 75483, "Data Retrieved Successfully", data)
        } else {
            return new CommonResponse(false, 4579, "There Is No staff names")
        }
    }

    async getStaffVerification(req: StaffDto): Promise<CommonResponse> {
        let data = null;

        if (req.phoneNumber) {
            data = await this.staffRepository.findOne({ where: { phoneNumber: req.phoneNumber } });
        } else if (req.staffId) {
            data = await this.staffRepository.findOne({ where: { staffId: req.staffId } });
        } else if (req.aadharNumber) {
            data = await this.staffRepository.findOne({ where: { aadharNumber: req.aadharNumber } });
        } else if (req.email) {
            data = await this.staffRepository.findOne({ where: { email: req.email } });
        }

        if (data) {
            return new CommonResponse(true, 75483, "Data already exists");
        } else {
            return new CommonResponse(false, 4579, "No matching data found");
        }
    }

}
